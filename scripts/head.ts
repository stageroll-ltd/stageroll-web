// One page's HTML: the shell (index.html) with that page's title and
// description in the head and its rendered markup in the body. Shared by the
// build's prerender (scripts/prerender.mjs) and the dev server
// (vite.config.ts), so a page in `yarn dev` is the same HTML the build writes.
// Plain enough for Node to run without a build step (type stripping).

export type Page = {
  path: string
  title: string
  description: string
  noindex?: boolean
  /** The sitemap's lastmod (YYYY-MM-DD): see `updated` in src/routes.tsx. */
  updated?: string
  /** Structured data for this page, each object written as its own JSON-LD block. */
  jsonLd?: object[]
}

export const siteUrl = 'https://stageroll.co'

const hole = '<div id="root"></div>'

const escape = (s: string) =>
  s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// A JSON-LD block. It is data, never run, so the Content-Security-Policy
// (vite.config.ts) does not apply to it; `<` is escaped so no string in it
// can close the tag.
const ld = (data: object) => `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`

// Swap one attribute's value on the tag that carries `key`; the shell's
// value is the home page's and each other page writes its own.
function setAttr(html: string, key: string, attr: string, value: string): string {
  const re = new RegExp(`(<[^>]*${key}[^>]*\\s${attr}=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`index.html has no tag with ${key} and ${attr}`)
  return html.replace(re, `$1${escape(value)}$2`)
}

export function fill(shell: string, page: Page, body: string): string {
  if (!shell.includes(hole)) throw new Error(`index.html has no ${hole}`)
  const url = siteUrl + page.path
  let html = shell.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
  html = setAttr(html, 'name="description"', 'content', page.description)
  html = setAttr(html, 'property="og:title"', 'content', page.title)
  html = setAttr(html, 'property="og:description"', 'content', page.description)
  html = setAttr(html, 'name="twitter:title"', 'content', page.title)
  html = setAttr(html, 'name="twitter:description"', 'content', page.description)
  html = setAttr(html, 'property="og:url"', 'content', url)
  html = setAttr(html, 'rel="canonical"', 'href', url)
  // The account pages and the 404 page stay out of search results.
  if (page.noindex) html = setAttr(html, 'name="robots"', 'content', 'noindex')
  if (page.jsonLd?.length) html = html.replace('</head>', `  ${page.jsonLd.map(ld).join('\n    ')}\n  </head>`)
  return html.replace(hole, `<div id="root">${body}</div>`)
}

/** The sitemap: every page that may be indexed, with its lastmod where known. */
export function sitemap(pages: Page[]): string {
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => `  <url><loc>${siteUrl}${p.path}</loc>${p.updated ? `<lastmod>${p.updated}</lastmod>` : ''}</url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}
