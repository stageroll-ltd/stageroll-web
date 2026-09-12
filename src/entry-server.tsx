import { renderToString } from 'react-dom/server'

import { App } from './App'

// The page as HTML, for scripts/prerender.mjs to put into dist/index.html at
// build time. The browser then hydrates it (main.tsx) rather than drawing it
// from nothing, so the words are in the response and not only in the JS.
export function render(): string {
  return renderToString(<App />)
}
