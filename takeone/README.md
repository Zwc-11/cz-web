# TakeOne product page

A scroll-directed 3D product page for [TakeOne](https://devpost.com/software/takeone-erqv3l), the AI film director with a robot camera crew (top-scoring finalist, Hack the North 2026). The page itself is shot like a film: each section is one of TakeOne's camera moves, performed on a real-time model of the rig.

## What's on the page

| Section | Camera move | What happens |
| --- | --- | --- |
| Start | `crane_reveal` | Slate claps, stage lights come up, the phone arm follows your cursor |
| Talk | `push_in` | The conversation plays as subtitles; the speaker pulses when TakeOne talks |
| Rehearse | `orbit` | The stage turns into the simulator: one-foot grid, planned path, phone frustum |
| Direct | locked off | Pick or type a move. The tool call, compile, preflight and turn budget play out, the cart repositions and films, and the monitor is a live render from the phone on the arm |
| Edit | top shot | Your takes land on a timeline folded from an append-only operation log, with undo and redo |
| Rig | `orbit` | The cart rolls off set and comes apart into labelled parts, then the real photos |
| Wrap | `pull_out` | Lights go down to the ring light; links and credits |

Moves you can call in the console: push in, pull out, orbit, crane reveal, tilt up, follow me, dolly zoom. Free text works ("slow orbit, 8 seconds", "vertigo shot", "follow me as I walk").

Timings in the console replay numbers measured on the TakeOne laptop (compile 2.06 s cold, 0.04 s cached). Voice hops are the design budget.

## Run it

Node 22 or newer.

```bash
cd takeone
npm ci
npm run dev           # http://localhost:5173
npm run build         # static site in dist/
npm run build:single  # one self-contained HTML file in dist-single/
```

`base` is `./`, so the same build works at `username.github.io/<repo>/`, under a subfolder of another site, or opened from disk.

## Deploy

This folder lives inside the caesarzhou.com repository. The site's Pages workflow (`.github/workflows/pages.yml` at the repository root) builds it after the main site, into `server/public/takeone/`, so every push to `master` publishes it at [caesarzhou.com/takeone/](https://caesarzhou.com/takeone/). Run it on its own with `npm ci && npm run dev` from this folder.

## Where things live

| Change | File |
| --- | --- |
| Links, team, award, stack, dialogue, rehearsal steps, labels | `src/content.ts` |
| Section copy and layout | `src/ui/Sections.tsx`, `src/styles.css` |
| Page camera per section | `src/three/choreography.ts` |
| Rig model (cart, tower, arms, phone, ring light) | `src/three/Rig.tsx` |
| Set (cyclorama, softbox, fresnel, tape marks, sim grid) | `src/three/Set.tsx` |
| Camera moves the rig performs in the console | `src/three/templates.ts` |
| Frame loop: lights, camera, arm aiming, takes, monitor render | `src/three/Director.tsx` |
| Console and editor | `src/ui/Console.tsx`, `src/ui/Editor.tsx` |

## Accessibility and performance

- `prefers-reduced-motion`: no intro, no smooth scrolling, and camera moves between sections become cuts.
- Every control is a real button or input with visible focus; the console log is a live region.
- The rig is built from primitives in code: no model files, no HDR downloads. The monitor and thumbnails are extra renders of the same scene, drawn only when on screen.

Built by Caesar Zhou, Ryan Qin and Basil Liu. Page by [Caesar Zhou](https://github.com/Zwc-11).
