import { renderToString } from 'react-dom/server'

import { App } from './App'
import { notFound, routes, type Route } from './routes'

// Each page as HTML, for scripts/prerender.mjs to write into its own
// dist/<path>/index.html at build time. The browser then hydrates it
// (main.tsx) rather than drawing it from nothing, so the words are in the
// response and not only in the JS.
export function render(path: string): string {
  return renderToString(<App path={path} />)
}

/** The routes to prerender, without their components: what scripts/head.ts needs. */
export function pages(): Pick<Route, 'path' | 'title' | 'description' | 'noindex' | 'updated' | 'jsonLd'>[] {
  return [...routes, notFound].map(({ path, title, description, noindex, updated, jsonLd }) => ({
    path,
    title,
    description,
    noindex,
    updated,
    jsonLd,
  }))
}
