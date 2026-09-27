import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps every asset path relative, so the build works on
// GitHub Pages, a custom domain, or any static host without changes.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { target: 'es2022', assetsInlineLimit: 0, outDir: '../server/public', emptyOutDir: true },
})
