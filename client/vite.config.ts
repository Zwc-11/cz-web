import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { personJsonLd, siteHtml, siteMarkdown } from './src/content/siteText'

// Writes the page content into index.html (for agents, crawlers and no-JS visitors;
// React replaces it on load) and emits /llms.txt, both from src/content.
const siteText = (): Plugin => ({
  name: 'site-text',
  transformIndexHtml: html => html
    .replace('<div id="root"></div>', `<div id="root">${siteHtml()}</div>`)
    .replace('</head>', `  <script type="application/ld+json">${personJsonLd()}</script>\n  </head>`),
  generateBundle() { this.emitFile({ type: 'asset', fileName: 'llms.txt', source: siteMarkdown() }) },
})

// base './' keeps every asset path relative, so the build works on
// GitHub Pages, a custom domain, or any static host without changes.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), siteText()],
  build: { target: 'es2022', assetsInlineLimit: 0, outDir: '../server/public', emptyOutDir: true },
})
