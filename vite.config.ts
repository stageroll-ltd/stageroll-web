import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative asset paths, so the one page works wherever Pages serves it:
// the custom domain's root and the <owner>.github.io/<repo>/ preview both.
export default defineConfig(({ isSsrBuild }) => ({
  base: './',
  plugins: [react()],
  // `vite build --ssr src/entry-server.tsx` lands beside the client build
  // for scripts/prerender.mjs, which deletes it once the HTML is written.
  build: isSsrBuild ? { outDir: 'dist/server', copyPublicDir: false } : {},
}))
