# Project case studies

The index shows contribution, a key decision and evidence before asking a reader
to open a case study. All eleven builds remain accessible. Three selected builds
lead with real project media; smaller engineering entries and hackathon builds
follow the same content contract.

## Frontend structure

```text
Home
  ├─ Experience + visible outcomes
  ├─ FocusExplorer / QuickExplore → project or experience
  └─ ProjectIndex → URL filter state → ProjectCard
                         ↓
                useProjectRoute
                         ↓
        lazy ProjectCaseStudy → architecture / decisions / evidence
                         └─ ProjectGallery (nested accessible dialog)
```

- `content/caseStudies.ts` owns contributions, decisions, system flows and scope.
- `content/portfolio.ts` joins that copy to compact `projectMetadata.json` records,
  sources and tags. Historical prose remains in `archive.json` and is not shipped
  in the initial bundle.
- `ProjectIndex` owns search and filters. `q` and `focus` survive reloads and a
  return from a case study.
- `useProjectRoute` owns `project`, browser history and return focus. Query URLs
  work on GitHub Pages without a server fallback. Case-to-case navigation replaces
  the current entry, so Back returns to the index instead of walking every case.
- `ProjectCaseStudy` is loaded on demand. The existing v2 story panels are also
  loaded on demand. `RouteBoundary` gives chunk failures a recoverable interface.
- Section navigation scrolls inside the case without adding history entries.
- Native anchors retain open-in-new-tab behavior. Radix dialogs provide focus
  containment, Escape handling and background isolation. The gallery retains
  its own focus and returns to the case after closing.

## Content evidence

Reviewed 2026-10-08. Individual contribution statements come from the existing
personal project archive. Hackathon submissions describe shared team engineering;
they do not invent ownership of individual subsystems. Project media retain their
captions and sources in `content/projectMedia.ts`.

- [AgentReplay](https://github.com/Zwc-11/agentreplay): event log, graph compiler,
  evaluation, first-divergence interface; bundled drivers are not LLM scores.
- [Hindsight](https://github.com/Zwc-11/Hindsight): standalone Python evaluation,
  time guards, purged splits and run manifests. Tags describe the public evidence
  used here rather than the previous unverified Rust/C++ summary.
- [Murmur](https://github.com/Zwc-11/Murmur-ai-harness): the public coding-agent
  reliability harness is the proof shown here. Earlier site copy described a
  financial-document variant, while the supplied images show the coding harness.
- [MarketImmune](https://github.com/Zwc-11/Marketimmune): research dashboard,
  structured investigations and append-only audit. The local SOL panel and
  labeled fixtures remain distinct from a production benchmark.
- Other projects use their archived contribution records, notebooks, team
  submissions and linked demonstrations.

The hierarchy follows [Linear's design refresh](https://linear.app/now/behind-the-latest-design-refresh)
for predictable controls and calmer visual hierarchy. The case-study structure
uses [NN/g's portfolio guidance](https://www.nngroup.com/articles/ux-design-portfolios/)
on clear roles, decision reasoning and evidence. Applying that guidance to a
software portfolio is a design choice, not a claim about recruiter outcomes.

## Verification

`npm test` runs TypeScript checks plus navigation, multi-term search and content
coverage tests. Browser verification covers responsive layout, nested galleries,
URL sharing, filters, Back/Forward, return focus, keyboard tabs and existing v2
stories. Build and browser checks do not execute the systems described in the
case studies or certify their benchmarks.
