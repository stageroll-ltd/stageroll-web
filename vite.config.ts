import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { fill, sitemap, type Page } from './scripts/head.ts'

type Entry = { render(path: string): string; pages(): Page[] }

// `yarn dev` serves every page already rendered, as the build does
// (scripts/prerender.mjs): the page is whole on its first paint, so the
// crossfade between pages has something to fade between and the words are
// there before the script. Paths get the trailing slash GitHub Pages gives
// them, an unknown path gets the 404 page, and /sitemap.xml is the one the
// build writes.
function pagesInDev(): Plugin {
  return {
    name: 'stageroll:pages-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://dev')
        if (url.pathname === '/sitemap.xml') {
          try {
            const { pages } = (await server.ssrLoadModule('/src/entry-server.tsx')) as Entry
            res.writeHead(200, { 'Content-Type': 'application/xml' })
            return res.end(sitemap(pages()))
          } catch (e) {
            server.ssrFixStacktrace(e as Error)
            return next(e)
          }
        }
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

// The built pages' Content-Security-Policy, as a <meta>: GitHub Pages sends
// no headers of ours, and the account pages keep a session in this browser
// that can open a production's billing, so a script from anywhere else must
// not run here. Scripts are the site's own files, the shell's one inline
// script (by its hash, worked out from the built page so an edit to it
// never needs a second edit here) and Cloudflare's Turnstile; the page
// talks only to itself and the Supabase project. Styles keep
// 'unsafe-inline': React writes style attributes into the prerendered
// pages. A <meta> cannot say frame-ancestors; that needs a host that sends
// headers. Build only: the dev server's own inline scripts and socket
// would need holes that the live page should not have.
function contentSecurityPolicy(supabaseUrl: string): Plugin {
  return {
    name: 'stageroll:csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
          ([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`,
        )
        const api = supabaseUrl ? new URL(supabaseUrl) : null
        const policy = [
          `default-src 'self'`,
          `script-src 'self' ${hashes.join(' ')} https://challenges.cloudflare.com`,
          `style-src 'self' 'unsafe-inline'`,
          `img-src 'self' data: blob:${api ? ` ${api.origin}` : ''}`,
          `font-src 'self' data:`,
          `connect-src 'self'${api ? ` ${api.origin} wss://${api.host}` : ''}`,
          `frame-src https://challenges.cloudflare.com`,
          `object-src 'none'`,
          `base-uri 'self'`,
          `form-action 'self'`,
        ].join('; ')
        return html.replace(
          '<meta name="viewport"',
          `<meta http-equiv="Content-Security-Policy" content="${policy}" />\n    <meta name="viewport"`,
        )
      },
    },
  }
}

// Served at the domain's root (public/CNAME), so absolute asset paths: the
// pages live in folders (/about/, /privacy/) and relative paths would
// resolve against each folder instead of the root.
export default defineConfig(({ mode, isSsrBuild }) => ({
  base: '/',
  plugins: [
    react(),
    pagesInDev(),
    contentSecurityPolicy(loadEnv(mode, process.cwd(), 'VITE_').VITE_SUPABASE_URL ?? ''),
  ],
  // A build without the account pages (VITE_ACCOUNT_PAGES not 'on': the
  // deploy; `yarn dev` turns them on itself, package.json) gets
  // src/account/pages.off.ts in pages.ts's place, so nothing under account/
  // is built: not the pages' chunks, not Supabase, not its keys. An alias,
  // not a flag in the code: tree-shaking left the chunks and the keys behind.
  resolve: {
    alias:
      loadEnv(mode, process.cwd(), 'VITE_').VITE_ACCOUNT_PAGES === 'on'
        ? []
        : [{ find: /^(\.{1,2}\/account\/pages)$/, replacement: '$1.off' }],
  },
  // `vite build --ssr src/entry-server.tsx` lands beside the client build
  // for scripts/prerender.mjs, which deletes it once the HTML is written.
  build: isSsrBuild ? { outDir: 'dist/server', copyPublicDir: false } : {},
}))
