# Caesar Zhou — Portfolio

The current portfolio for [caesarzhou.com](https://caesarzhou.com). It is a compact, accessible React and Vite site with separate Experience and Projects tabs, 11 documented projects, and original project imagery. Project media sources are recorded in [docs/project-image-sources.md](docs/project-image-sources.md).

## Run locally

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). `npm ci` at the repository root installs the client and static server dependencies. Press Ctrl+C to stop the development server.

## Build and serve

```bash
npm run build
npm start
```

The build writes to `server/public`. The small Express server serves those static files on `PORT` (default 3001), including the site's query and hash based views. The site has no API or contact form; the résumé request uses email.

GitHub Actions checks the production build and TypeScript on Node 22, and publishes the same build to GitHub Pages. The live custom domain has also used Render's Node service; its start command should remain `npm start` and its build command `npm run build` after installing dependencies.

The previous cinematic portfolio was removed from the current tree when this version replaced it. Its source remains available in Git history.
