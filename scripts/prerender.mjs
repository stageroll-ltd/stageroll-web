// After the client and server builds: render the page once and write the
// HTML into dist/index.html's #root, then drop the server bundle.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const { render } = await import(pathToFileURL('dist/server/entry-server.js').href)

const page = 'dist/index.html'
const html = await readFile(page, 'utf8')
const hole = '<div id="root"></div>'
if (!html.includes(hole)) throw new Error(`${page} has no ${hole}`)

await writeFile(page, html.replace(hole, `<div id="root">${render()}</div>`))
await rm('dist/server', { recursive: true, force: true })
console.log('prerendered dist/index.html')
