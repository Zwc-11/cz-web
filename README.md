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

GitHub Actions checks the production build, TypeScript and engineering demo tests on Node 22, and publishes the same build to GitHub Pages. The live custom domain has also used Render's Node service; its start command should remain `npm start` and its build command `npm run build` after installing dependencies.

## Interactive engineering demos

The homepage's **Try the engineering** section opens three experiments. They load as a separate module on demand and support direct links: `?demo=replay`, `?demo=data` and `?demo=requests`.

- **Replay & debug:** immutable workflow states, step inspection and first-divergence detection.
- **Time & data:** historical snapshots that exclude future observations and unpublished revisions.
- **Parallel requests:** a bounded async queue, local timing traces, response caching, isolated failures and cancellation.

These are executable browser examples with synthetic records and timer-based endpoints. They illustrate the ideas behind the work; they do not connect to the project backends. The core logic is in `client/src/lib/engineering.ts`. Run `npm test` for TypeScript and the logic tests, or `npm run test:engineering` for the tests alone.

The previous cinematic portfolio was removed from the current tree when this version replaced it. Its source remains available in Git history.
