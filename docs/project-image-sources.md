# Project image sources

Added September 26, 2026. All 11 portfolio entries now have real source imagery: 26 gallery images in total. No AI-generated images are used. Screenshots of archived versions and video thumbnails are identified in visitor-facing captions. These images document the projects; they do not independently verify benchmark, performance or award claims.

## Source inventory

| Project | Images | Source and local files under `public/` |
| --- | --- | --- |
| TakeOne | 4 | [Devpost submission](https://devpost.com/software/takeone-erqv3l). Existing `takeone/rig-front.jpg`, `sim.jpg`, `rig-ring.jpg`, `rig-top.jpg`. |
| Hindsight | 1 | [Repository tearsheet](https://github.com/Zwc-11/Hindsight/blob/main/docs/assets/flagship-tearsheet.png), fetched through the repository HEAD. `projects/media/hindsight-tearsheet.png`. |
| Murmur | 2 | [Repository](https://github.com/Zwc-11/Murmur-ai-harness). Existing archived `projects/murmur-fan-report.png`, `murmur-trace-viewer.png`. Earlier product version, labelled accordingly. |
| MarketImmune | 5 | [Repository](https://github.com/Zwc-11/Marketimmune). Existing archived `projects/mi-command.png`, `mi-live.png`, `mi-immune-loop.png`, `mi-investigation.png`, `mi-models.png`. |
| AgentReplay | 2 | [Repository](https://github.com/Zwc-11/agentreplay). Existing archived `projects/agentreplay-calendar.png`, `agentreplay-live-test.png`. |
| ChaosWing | 1 | [Repository](https://github.com/Zwc-11/Chaoswing). Existing archived `projects/chaoswing-live.png` showing the API reference. |
| Quant Portfolio | 1 | [Repository](https://github.com/Zwc-11/Quantitative-Portfolio-Management-Strategy). Existing `projects/quant-repo.png`. The notebook has no embedded chart PNGs; no synthetic performance chart was substituted. |
| AutoDump | 3 | [Devpost submission](https://devpost.com/software/autodump-autonomous-self-emptying-trash-rover). `projects/media/autodump-navigation.jpg`, `autodump-upper.jpg`, `autodump-drive.jpg`, plus original CDN thumbnail variants for index cards. |
| Automatic Modular Watering System / BioTron | 2 | [Original demo](https://www.youtube.com/watch?v=nycreUS2ojM) and [Hardware Award video](https://www.youtube.com/watch?v=u3dLvmsocYU), linked from teammate Ryan Qin's public profile. `projects/media/biotron-demo.jpg`, `biotron-award.jpg` are YouTube thumbnails, explicitly labelled, not extracted high-resolution frames. |
| Baymax Bot | 1 | [DoraHacks submission](https://dorahacks.io/buidl/21720). `projects/media/baymax-bot.png`, a two-photo montage of the prototype and electronics. |
| DayCube | 4 + video | [Repository media](https://github.com/Zwc-11/DayCube/tree/main/docs/media), added October 24, 2026. `projects/media/daycube-demo.mp4` is the repository's 19-second demo (audio stripped, faststart); `daycube-cover.mp4` is an 800×500 re-encode for the project card, with poster frames `daycube-cover.jpg` and `daycube-poster.jpg`. Each clip also has a VP9 `.webm` copy for browsers without H.264. `daycube-stairs-climb.jpg`, `daycube-upper-floor.jpg`, `daycube-day-stack.jpg`, `daycube-ask-answer.jpg` are JPEG conversions of the repository PNGs. The sample day shown is fictional and labelled illustrative in the app. |
| SproutPass | 5 | [Devpost submission](https://devpost.com/software/sproutpass), added October 19, 2026. `projects/media/sproutpass-encounter.jpg`, `sproutpass-pets.jpg`, `sproutpass-offer.jpg`, `sproutpass-receipt.jpg`, `sproutpass-approved.jpg`. `sproutpass-cover.jpg` (and `-thumb`) is a montage of the encounter, offer and receipt screenshots on a plain background. The sixth Devpost image (an iMessage thread) is not used because it shows a phone number. LA Hacks logo `logos/lahacks.png` is the event's Devpost thumbnail, resized to 128 px. |
| XRSZE | 4 | [Devpost submission](https://devpost.com/software/xrsze). `projects/media/xrsze-640.png` shows the pose-tracking demo; `xrsze-cover.png`, `xrsze-642.png`, `xrsze-641.png` show the homepage, chat and about screens. |

## New asset URLs

BioTron identification and the JamHacks 8 date (June 2024) were cross-checked against the public profiles of [Caesar Zhou](https://ca.linkedin.com/in/caesar-zhou-487558249) and [Ryan Qin](https://ca.linkedin.com/in/ryan-qin-ece). The current portfolio corrects the old archive's 2025 label; the archived input remains intact.

- Hindsight: `https://raw.githubusercontent.com/Zwc-11/Hindsight/HEAD/docs/assets/flagship-tearsheet.png`
- AutoDump: `https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/960/429/datas/original.JPG` (upper), `430` (navigation), `431` (drive). Thumbnail suffix: `/datas/gallery.jpg`.
- Baymax: `https://cdn.dorahacks.io/static/files/1947e2372eaedeab437854d4094a37dc.png`
- XRSZE: `https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/023/640/datas/original.png` (demo), `639` (homepage), `642` (chat), `641` (about).
- SproutPass: `https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/617/647/datas/original.jpg` (encounter), `610` (pets), `611` (offer), `613` (receipt), `612` (approved).
- LA Hacks logo: `https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/004/732/163/datas/large.png`
- BioTron demo: `https://i.ytimg.com/vi/nycreUS2ojM/hqdefault.jpg`
- BioTron award: `https://i.ytimg.com/vi/u3dLvmsocYU/hqdefault.jpg`

The index lazy-loads images, uses CDN-provided smaller AutoDump thumbnails, and loads full-resolution originals when the gallery opens. Galleries support previous/next buttons, keyboard arrows, Escape, focus restoration and reduced-motion preferences. Screenshots are contained to preserve interface details. Source links open externally without embedding tracking video players.
