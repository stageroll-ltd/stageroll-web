import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative asset paths, so the one page works wherever Pages serves it:
// the custom domain's root and the <owner>.github.io/<repo>/ preview both.
export default defineConfig({
  base: './',
  plugins: [react()],
})
