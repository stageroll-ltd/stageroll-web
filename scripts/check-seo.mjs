// The last step of `yarn build`: reads the built site in dist/ the way a
// search engine would and fails the build (so the deploy never runs) if a
// page would ship broken for search. Each check rests on Google's own docs:
// one title and description per page, unique across the site
// (developers.google.com/search/docs/appearance/title-link and /snippet); a
// canonical that is the page's own address
// (/crawling-indexing/consolidate-duplicate-urls); a sitemap of exactly the
// pages that may be indexed, with honest dates (/crawling-indexing/sitemaps/build-sitemap);
// structured data that parses, and the site's name on the home page
// (/appearance/site-names); a robots.txt that lets crawlers in.
import { access, readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const site = 'https://stageroll.co'
const dist = 'dist'
const failures = []
const fail = (where, what) => failures.push(`${where}: ${what}`)

async function htmlFiles(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await htmlFiles(path)))
    else if (entry.name.endsWith('.html')) out.push(path)
  }
  return out
}

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0])

// The sitemap and robots.txt.
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
const listed = new Map(
  [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map((m) => [m[1], m[2]]),
)
const today = new Date().toISOString().slice(0, 10)
for (const [loc, lastmod] of listed) {
  if (lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) fail('sitemap.xml', `${loc} has lastmod "${lastmod}", not YYYY-MM-DD`)
  if (lastmod && lastmod > today) fail('sitemap.xml', `${loc} has lastmod ${lastmod}, after today`)
}
const robots = await readFile(join(dist, 'robots.txt'), 'utf8')
if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'disallows the whole site')
if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) fail('robots.txt', 'does not name the sitemap')

// Every page.
const seenTitles = new Map()
const seenDescriptions = new Map()
const indexable = new Set()
for (const file of await htmlFiles(dist)) {
  const rel = relative(dist, file).split(sep).join('/')
  const path = rel === '404.html' ? '/404/' : `/${rel.replace(/index\.html$/, '')}`
  const html = await readFile(file, 'utf8')
  const where = path

  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1].trim())
  if (titles.length !== 1 || !titles[0]) fail(where, `has ${titles.length} titles`)
  const descriptions = tags(html, /<meta name="description"[^>]*>/g).map((t) => attr(t, 'content') ?? '')
  if (descriptions.length !== 1 || !descriptions[0]) fail(where, `has ${descriptions.length} meta descriptions`)

  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html)
  const url = site + path
  if (noindex) {
    if (listed.has(url)) fail(where, 'is noindex but in the sitemap')
  } else {
    indexable.add(url)
    // The account pages are drawn in the browser, so only a page that may be
    // indexed must carry its heading in the HTML.
    const h1s = (html.match(/<h1[\s>]/g) ?? []).length
    if (h1s !== 1) fail(where, `has ${h1s} h1 headings`)
    const canonical = tags(html, /<link rel="canonical"[^>]*>/g).map((t) => attr(t, 'href'))
    if (canonical.length !== 1 || canonical[0] !== url) fail(where, `canonical is ${canonical.join(', ') || 'missing'}, not ${url}`)
    const ogUrl = tags(html, /<meta property="og:url"[^>]*>/g).map((t) => attr(t, 'content'))[0]
    if (ogUrl !== url) fail(where, `og:url is ${ogUrl}, not ${url}`)
    if (!listed.has(url)) fail(where, 'may be indexed but is not in the sitemap')
    for (const [seen, value, kind] of [
      [seenTitles, titles[0], 'title'],
      [seenDescriptions, descriptions[0], 'description'],
    ]) {
      if (seen.has(value)) fail(where, `has the same ${kind} as ${seen.get(value)}`)
      else seen.set(value, path)
    }
  }

  // The share image must be a file the site serves.
  for (const tag of tags(html, /<meta (?:property="og:image"|name="twitter:image")[^>]*>/g)) {
    const src = attr(tag, 'content') ?? ''
    if (!src.startsWith(`${site}/`)) fail(where, `share image ${src} is not on ${site}`)
    else await access(join(dist, src.slice(site.length))).catch(() => fail(where, `share image ${src} is not in dist`))
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
  const types = []
  for (const block of blocks) {
    try {
      const data = JSON.parse(block)
      if (data['@context'] !== 'https://schema.org') fail(where, 'has JSON-LD without @context https://schema.org')
      for (const node of data['@graph'] ?? [data]) types.push(node['@type'])
    } catch (e) {
      fail(where, `has JSON-LD that does not parse: ${e.message}`)
    }
  }
  if (path === '/' && !types.includes('WebSite')) fail(where, 'has no WebSite structured data (the site name)')
}

for (const loc of listed.keys()) if (!indexable.has(loc)) fail('sitemap.xml', `lists ${loc}, which is not an indexable page`)

if (failures.length) {
  console.error(`SEO check failed:\n  ${failures.join('\n  ')}`)
  process.exit(1)
}
console.log(`SEO check passed: ${indexable.size} indexable pages, all in the sitemap`)
