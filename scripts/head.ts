// One page's HTML: the shell (index.html) with that page's title and
// description in the head and its rendered markup in the body. Shared by the
// build's prerender (scripts/prerender.mjs) and the dev server
// (vite.config.ts), so a page in `yarn dev` is the same HTML the build writes.
// Plain enough for Node to run without a build step (type stripping).

export type Page = { path: string; title: string; description: string }

export const siteUrl = 'https://stageroll.co'

const hole = '<div id="root"></div>'

const escape = (s: string) =>
  s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

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
  return html.replace(hole, `<div id="root">${body}</div>`)
}
