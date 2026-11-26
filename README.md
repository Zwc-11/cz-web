# Caesar Zhou

Source for [caesarzhou.com](https://caesarzhou.com): four pages (`/`, `/work/`, `/projects/`, `/hackathons/`) plus a case study per project at `?project=<id>` on any of them. React, Vite and Tailwind, served as static files; the build writes an `index.html` into each page's folder so every path loads directly.

## Run locally

Node.js 22 or newer.

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # typecheck + content tests
npm run build      # writes server/public
npm start          # serves server/public on PORT (default 3001)
```

Pushing to `master` builds and publishes to GitHub Pages.

## Where things live

| Change | File |
| --- | --- |
| Intro and "Recently" | `client/src/components/pages/HomePage.tsx` |
| Pages, tabs and their paths | `client/src/lib/pages.ts`, `client/src/components/Site.tsx` |
| Pixel background (shapes, density, colours) | `client/src/components/PixelField.tsx` |
| Jobs | `client/src/content/experience.ts` |
| Project cards (cover, award, which are featured) | `client/src/content/onepage.ts` |
| Hackathons, education, top photos | `client/src/content/onepage.ts` |
| Project write-ups | `client/src/content/caseStudies.ts` |
| Project year, stack, links | `client/src/content/projectMetadata.json` |
| Project images and videos | `client/src/content/projectMedia.ts` |
| Name, email, socials | `client/src/content/profile.ts` |
| TakeOne product page at `/takeone/` (separate Vite + Three.js app) | `takeone/`, see `takeone/README.md` |

Every project id must appear, in the same newest-first order, in `caseStudies.ts` (`projectOrder`), `projectMetadata.json` and `projectCards`; `npm test` checks this.

## For agents and crawlers

The build writes the full content as static HTML inside `#root` (React replaces it on load), adds schema.org `Person` JSON-LD, and emits `/llms.txt` with every case study in Markdown. All three are generated from `client/src/content` by `client/src/content/siteText.ts`, so they never drift from the page.

Project media sources are recorded in [docs/project-image-sources.md](docs/project-image-sources.md).
