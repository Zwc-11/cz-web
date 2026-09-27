import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds preview/index.html: one self-contained file (JS, CSS and fonts inlined)
// that opens straight from disk with a double-click, no server needed.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { outDir: 'preview', emptyOutDir: true, assetsInlineLimit: 100_000_000, cssCodeSplit: false },
})
