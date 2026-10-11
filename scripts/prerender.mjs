// After the client and server builds: render every route and write each one
// to dist/<path>/index.html, with its own title and description in the head,
// then drop the server bundle. The 404 route becomes dist/404.html, which
// GitHub Pages serves for any path that has no file.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { fill } from './head.ts'

const { render, pages } = await import(pathToFileURL('dist/server/entry-server.js').href)
const shell = await readFile('dist/index.html', 'utf8')

for (const page of pages()) {
  const file = page.path === '/404/' ? 'dist/404.html' : join('dist', page.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, fill(shell, page, render(page.path)))
  console.log(`prerendered ${file}`)
}

await rm('dist/server', { recursive: true, force: true })
