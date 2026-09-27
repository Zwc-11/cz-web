export type ProjectImage = {
  src: string
  thumb?: string
  alt: string
  caption: string
  source: string
  sourceLabel: string
  fit?: 'cover' | 'contain'
}

const devpost = (slug: string) => `https://devpost.com/software/${slug}`
const github = (repo: string) => `https://github.com/Zwc-11/${repo}`
const screenshot = (src: string, alt: string, source: string, caption = 'Screenshot from the project archive.'): ProjectImage => ({ src: `projects/${src}`, alt, caption, source, sourceLabel: 'Project source', fit: 'contain' })

// Real project media only. Source and acquisition notes: docs/project-image-sources.md.
export const projectMedia: Record<string, ProjectImage[]> = {
  takeone: [
    {src:'takeone/rig-front.jpg',alt:'TakeOne mobile camera and lighting rig',caption:'The camera and lighting rig built at Hack the North 2026.',source:devpost('takeone-erqv3l'),sourceLabel:'Devpost'},
    {src:'takeone/sim.jpg',alt:'TakeOne 3D rehearsal simulator',caption:'The TakeOne rehearsal simulator.',source:devpost('takeone-erqv3l'),sourceLabel:'Devpost',fit:'contain'},
    {src:'takeone/rig-ring.jpg',alt:'TakeOne ring light and camera assembly',caption:'A closer look at the lighting assembly.',source:devpost('takeone-erqv3l'),sourceLabel:'Devpost'},
    {src:'takeone/rig-top.jpg',alt:'TakeOne rig viewed from above',caption:'The rig and onboard components, viewed from above.',source:devpost('takeone-erqv3l'),sourceLabel:'Devpost'},
  ],
  hindsight: [screenshot('media/hindsight-tearsheet.png','Hindsight audit tearsheet comparing naive and leakage-audited strategy rankings',github('Hindsight/blob/main/docs/assets/flagship-tearsheet.png'),'Published audit tearsheet from the Hindsight repository. This is a recorded result, not a live benchmark.')],
  murmur: [
    screenshot('murmur-fan-report.png','Murmur reliability report with pass rates and repeated-attempt outcomes',github('Murmur-ai-harness'),'Archived reliability report from an earlier version of Murmur.'),
    screenshot('murmur-trace-viewer.png','Murmur agent trace viewer',github('Murmur-ai-harness'),'Archived agent-run trace viewer.'),
  ],
  marketimmune: [
    screenshot('mi-command.png','MarketImmune command center with agent-loop and market telemetry',github('Marketimmune')),
    screenshot('mi-live.png','MarketImmune market data interface',github('Marketimmune'),'Archived market-data interface; values shown are from the captured session.'),
    screenshot('mi-immune-loop.png','MarketImmune six-agent orchestration view',github('Marketimmune')),
    screenshot('mi-investigation.png','MarketImmune investigation case file',github('Marketimmune')),
    screenshot('mi-models.png','MarketImmune model evaluation interface',github('Marketimmune')),
  ],
  agentreplay: [
    screenshot('agentreplay-calendar.png','AgentReplay calendar workflow and first-divergence analysis',github('agentreplay')),
    screenshot('agentreplay-live-test.png','AgentReplay checkout failure analysis',github('agentreplay')),
  ],
  chaoswing: [screenshot('chaoswing-live.png','ChaosWing developer API reference interface',github('Chaoswing'),'Archived screenshot of the deployed ChaosWing API reference.')],
  'quant-portfolio': [screenshot('quant-repo.png','Quant Portfolio repository with the notebook and competition ticker dataset',github('Quantitative-Portfolio-Management-Strategy'),'Repository view of the actual notebook, ticker dataset and strategy write-up.')],
  autodump: [
    {src:'projects/media/autodump-navigation.jpg',thumb:'projects/media/autodump-navigation-thumb.jpg',alt:'AutoDump cardboard rover with Raspberry Pi, sensors and wheeled base',caption:'Obstacle-navigation hardware from the MakeCU 2025 submission.',source:devpost('autodump-autonomous-self-emptying-trash-rover'),sourceLabel:'Devpost'},
    {src:'projects/media/autodump-upper.jpg',thumb:'projects/media/autodump-upper-thumb.jpg',alt:'AutoDump servo and electronics for the dumping mechanism',caption:'The upper dumping mechanism and electronics.',source:devpost('autodump-autonomous-self-emptying-trash-rover'),sourceLabel:'Devpost'},
    {src:'projects/media/autodump-drive.jpg',thumb:'projects/media/autodump-drive-thumb.jpg',alt:'AutoDump lower drive mechanism',caption:'The lower drive mechanism.',source:devpost('autodump-autonomous-self-emptying-trash-rover'),sourceLabel:'Devpost'},
  ],
  jamhacks8: [
    {src:'projects/media/biotron-demo.jpg',alt:'BioTron demo thumbnail showing a phone and plant',caption:'Thumbnail from the original BioTron demonstration video. Modular watering project, JamHacks 8.',source:'https://www.youtube.com/watch?v=nycreUS2ojM',sourceLabel:'Watch the original demo',fit:'contain'},
    {src:'projects/media/biotron-award.jpg',alt:'Thumbnail from the JamHacks hardware award video',caption:'Thumbnail from the team’s hardware award video.',source:'https://www.youtube.com/watch?v=u3dLvmsocYU',sourceLabel:'Watch the award video',fit:'contain'},
  ],
  'baymax-bot': [
    {src:'projects/media/baymax-bot.png',alt:'Two photos of the Baymax Bot prototype showing its shell and internal electronics',caption:'The Baymax Bot prototype and its internal hardware at UofTHacks 12.',source:'https://dorahacks.io/buidl/21720',sourceLabel:'DoraHacks',fit:'contain'},
  ],
  xrsze: [
    {src:'projects/media/xrsze-640.png',alt:'XRSZE exercise demo with pose tracking and a repetition count',caption:'The team demonstrating pose tracking and repetition counting at Hack the North 2024.',source:devpost('xrsze'),sourceLabel:'Devpost',fit:'contain'},
    {src:'projects/media/xrsze-cover.png',alt:'XRSZE fitness application homepage',caption:'The submitted XRSZE homepage.',source:devpost('xrsze'),sourceLabel:'Devpost',fit:'contain'},
    {src:'projects/media/xrsze-642.png',alt:'XRSZE AI workout chat interface',caption:'The AI workout chat interface from the hackathon submission.',source:devpost('xrsze'),sourceLabel:'Devpost',fit:'contain'},
    {src:'projects/media/xrsze-641.png',alt:'XRSZE about page',caption:'The project introduction from the hackathon submission.',source:devpost('xrsze'),sourceLabel:'Devpost',fit:'contain'},
  ],
}
