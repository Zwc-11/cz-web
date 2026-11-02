# Caesar Zhou

Source for [caesarzhou.com](https://caesarzhou.com): one page (intro, experience, projects, hackathons, education) plus a case study per project at `?project=<id>`. React, Vite and Tailwind, served as static files.

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
| Intro and "Recently" | `client/src/components/Home.tsx` |
| Jobs | `client/src/content/experience.ts` |
| Project cards (cover, award, which are featured) | `client/src/content/onepage.ts` |
| Hackathons, education, top photos | `client/src/content/onepage.ts` |
| Project write-ups | `client/src/content/caseStudies.ts` |
| Project year, stack, links | `client/src/content/projectMetadata.json` |
| Project images and videos | `client/src/content/projectMedia.ts` |
| Name, email, socials | `client/src/content/profile.ts` |

Every project id must appear, in the same newest-first order, in `caseStudies.ts` (`projectOrder`), `projectMetadata.json` and `projectCards`; `npm test` checks this.

## For agents and crawlers

The build writes the full content as static HTML inside `#root` (React replaces it on load), adds schema.org `Person` JSON-LD, and emits `/llms.txt` with every case study in Markdown. All three are generated from `client/src/content` by `client/src/content/siteText.ts`, so they never drift from the page.

Project media sources are recorded in [docs/project-image-sources.md](docs/project-image-sources.md).
