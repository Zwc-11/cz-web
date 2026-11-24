import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { personJsonLd, siteHtml, siteMarkdown } from './src/content/siteText'
import { pages } from './src/lib/pages'

// Writes the page content into index.html (for agents, crawlers and no-JS visitors;
// React replaces it on load) and emits /llms.txt, both from src/content.
const siteText = (): Plugin => ({
  name: 'site-text',
  transformIndexHtml: html => html
    .replace('<div id="root"></div>', `<div id="root">${siteHtml()}</div>`)
    .replace('</head>', `  <script type="application/ld+json">${personJsonLd()}</script>\n  </head>`),
  generateBundle() { this.emitFile({ type: 'asset', fileName: 'llms.txt', source: siteMarkdown() }) },
})

// Each page is a real path (/work/, /projects/, /hackathons/). A static host
// has no SPA fallback, so write a copy of index.html into each page's folder,
// with that page's title and canonical URL, plus 404.html for anything else.
const pageFiles = (): Plugin => ({
  name: 'page-files',
  apply: 'build',
  writeBundle(options) {
    const dir = options.dir!
    const html = readFileSync(path.join(dir, 'index.html'), 'utf8')
    const forPage = (title: string, url: string) => html
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
      .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
      .replace('</head>', `  <link rel="canonical" href="${url}" />\n  </head>`)
    for (const page of pages) {
      const url = `https://caesarzhou.com${page.path}`
      const file = page.path.slice(1) + 'index.html'
      mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
      writeFileSync(path.join(dir, file), forPage(page.title, url))
    }
    writeFileSync(path.join(dir, '404.html'), html)
  },
})

// base '/' resolves assets from the site root, so they load on every page
// path. Content paths go through lib/asset.ts for the same reason.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), siteText(), pageFiles()],
  build: { target: 'es2022', assetsInlineLimit: 0, outDir: '../server/public', emptyOutDir: true },
})
