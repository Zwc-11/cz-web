# Current scope: continue v2

The active design now uses a short introduction and explicit Experience / Projects tabs. After reviewing wzeng.dev again, the user approved this more direct structure. The palette and typography continue v2; full-screen takes remain optional deeper views. Current visual evidence is prefixed v2-tabs-; previous statement screenshots are historical.

# Design and content decisions

## Reference review

Visually reviewed the live pages on 26 September 2026:

- https://martinsit.ca — compact reading width, restrained navigation, concise evidence, separate project area.
- https://www.wzeng.dev — readable serif/sans hierarchy, visible role chronology, substantial project/hackathon history, personal voice.
- https://caesarzhou.com and /about — source of prior experience, education, leadership, awards and social URLs.

The design borrows those principles, without reproducing the dotted background, signature, terminal, gamification, or floating icon dock. Clear tabs and compact rows replace the statement-only navigation. Full-screen takes and the TakeOne viewfinder remain. The refinements are warm paper, terracotta focus accents, subtle green recognition text and gentler grain.

## Design rationale

Experience is selected by default and displays all five organisations, dates, roles, employment types and one-line descriptions. Projects displays all eleven builds with direct links, expandable stories and a separate group for earlier hackathons. Education and recognition follow experience. A `?tab=projects` URL preserves the selected tab through refresh and browser navigation. Arrow keys, Home and End navigate the accessible tablist. The four original take URLs remain available; closing a deeper view returns to the tab and opener that launched it.

Research: https://www.nngroup.com/articles/progressive-disclosure/

Accessibility target: readable text, contrast, keyboard access, visible focus, labelled controls, native disclosure elements, reduced-motion support, and comfortably spaced controls. These are informed by WCAG 2.2; the checks performed here are not a comprehensive WCAG conformance certification.

Reference: https://www.w3.org/TR/WCAG22/

## Personal colour direction

The user subsequently asked for this influence to be more visible and for additional interactions. The introduction now includes an interactive wood-and-fire seal: an original SVG branch, sun and 木 / 火 characters. Its palette disclosure explains the personal cultural reference without exposing birth details. A keyboard-accessible range control blends wood-green and terracotta accents, remembers the visitor's preference locally, and can reset to 75% fire. The pointer tilt and sun movement respect reduced motion. This does not establish either element as a definitive favourable element in a professional chart reading.

Project discovery now includes topic/technology search, All / AI & agents / Markets & data / Hackathons filters, and an optional project picker. The picker chooses within the current results, avoids the previous pick when alternatives exist, expands its story and moves focus there. Empty results have a clear reset. These controls supplement the two main tabs.

The user requested a traditional five-phase influence. The seasonal passage on winter Geng metal in Qiong Tong Bao Jian emphasises warming fire and supporting wood. This is used only as cultural design inspiration, not a factual claim about personality, health, destiny or hiring outcomes. A full favourable-element judgment is not established by counting elements alone.

Primary traditional text: https://zh.wikisource.org/zh-hans/穷通宝鉴

Palette: warm paper `#FAF8F4`, ink `#292923`, terracotta `#AE4936`, muted green `#49674E`. Dark mode uses deep green-charcoal `#191C19` with light text and warmer accents. Instrument Serif provides expressive headings; Instrument Sans carries the readable body; mono is limited to indices and metadata. Birth details are deliberately absent from the code and site.

## Content inventory

| Area | Sources | Result |
| --- | --- | --- |
| Current role | September v2 + supplied conversation | Forward Deployed Engineer at ecobee |
| Experience | v2 deployments + old site's experience data | Five organisations; BrandEQ restored |
| Recent projects | v2 work data | Newer Hindsight, Murmur and MarketImmune descriptions retained |
| Earlier projects | Old project's source data and local screenshots | ChaosWing and Quant Portfolio restored; AgentReplay detail recovered |
| Robotics | Old hackathon records + v2 | AutoDump, Modular Watering, Baymax Bot, XRSZE; TakeOne featured |
| Education / recognition | Live About page + old data | Waterloo, Georges Vanier, FRC/VEX leadership, quantitative portfolio win, CCC, FLASH / Diamond Challenge |
| TakeOne award | https://devpost.com/software/takeone-erqv3l | Uses the specific prize category “Finalist” rather than implying overall first place |
| Social profiles | Live caesarzhou.com | Replaced the differing v2 LinkedIn and Devpost URLs with existing public URLs |

## Source boundaries

- Work and project numbers are inherited from the user's existing content. This task did not independently reproduce employer results or rerun project benchmarks.
- The older CSAA entry says May–September 2025; v2 says April–August. The UI shows 2025 pending a definitive date.
- The old site lists graduation in 2029; v2 says 2028. The UI shows Waterloo 2024–present.
- The September v2 dates supersede the old WDI “present” label; ecobee is the only role marked current.
- Older project screenshots are labelled with their archive month; they are not presented as fresh benchmark results.
- Modular Watering's original BioTron demo and hardware-award video were recovered during the image research. See `project-image-sources.md` for provenance.
- No Hamming AI employment claim is included.
- The existing résumé file is not part of this redesign. There is no broken download link and no public copy of its phone number.
- No generated portrait or decorative stock imagery was added.

## Publication

The final site lives in `client/` and builds into `server/public/`. The previous website was removed from the current Git tree; its code remains recoverable from history. The root checkout used for design work was left untouched, and publication uses a separate Git worktree.
