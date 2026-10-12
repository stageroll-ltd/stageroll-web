import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { fill, type Page } from './scripts/head.ts'

type Entry = { render(path: string): string; pages(): Page[] }

// `yarn dev` serves every page already rendered, as the build does
// (scripts/prerender.mjs): the page is whole on its first paint, so the
// crossfade between pages has something to fade between and the words are
// there before the script. Paths get the trailing slash GitHub Pages gives
// them, and an unknown path gets the 404 page.
function pagesInDev(): Plugin {
  return {
    name: 'stageroll:pages-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://dev')
        if (!req.headers.accept?.includes('text/html') || extname(url.pathname)) return next()
        if (!url.pathname.endsWith('/')) {
          res.writeHead(301, { Location: `${url.pathname}/${url.search}` })
          return res.end()
        }
        try {
          const { render, pages } = (await server.ssrLoadModule('/src/entry-server.tsx')) as Entry
          const known = pages().find((p) => p.path === url.pathname)
          const page = known ?? pages().find((p) => p.path === '/404/')
          if (!page) throw new Error('entry-server.tsx lists no 404 page')
          const shell = await readFile(join(server.config.root, 'index.html'), 'utf8')
          const html = fill(await server.transformIndexHtml(url.pathname, shell), page, render(url.pathname))
          res.writeHead(known ? 200 : 404, { 'Content-Type': 'text/html' })
          res.end(html)
        } catch (e) {
          server.ssrFixStacktrace(e as Error)
          next(e)
        }
      })
    },
  }
}

// Served at the domain's root (public/CNAME), so absolute asset paths: the
// pages live in folders (/about/, /privacy/) and relative paths would
// resolve against each folder instead of the root.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [react(), pagesInDev()],
  // `vite build --ssr src/entry-server.tsx` lands beside the client build
  // for scripts/prerender.mjs, which deletes it once the HTML is written.
  build: isSsrBuild ? { outDir: 'dist/server', copyPublicDir: false } : {},
}))
