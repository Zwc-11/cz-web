// Content for the single-page layout: hackathon timeline, project cards and education.
// Facts come from the existing portfolio data, Devpost and the project archive.

export type LinkKind = 'github' | 'devpost' | 'youtube' | 'website' | 'story'
export type CardLink = { kind: LinkKind; label: string; href: string }

export type Hackathon = {
  id: string
  name: string
  date: string
  place: string
  icon?: string // path under /public
  mark?: { text: string; bg: string; fg: string } // fallback when no logo exists
  won: boolean
  project: string
  projectId: string // case study id
  lines: string[]
  wins: string[]
  links: CardLink[]
}

export const hackathons: Hackathon[] = [
  {
    id: 'htn-2026',
    name: 'Hack the North 2026',
    date: 'Sep 18th – 20th, 2026',
    place: 'Waterloo, Ontario',
    icon: 'logos/htn.png',
    won: true,
    project: 'TakeOne',
    projectId: 'takeone',
    lines: [
      'Built "TakeOne", an AI-powered robotic film studio. Describe the shot out loud; a voice agent and AI director turn it into a structured camera plan, Python validates and rehearses it in a MuJoCo / Three.js simulator, then a cart with two SO-101 robot arms moves the camera and the light to film it.',
      'Cut preview compile time from ~2 s to ~40 ms. Recorded takes land in a React + FFmpeg editor. Built with Ryan Qin and Basil Liu.',
    ],
    wins: ['Finalist (highest score out of 12 finalists)'],
    links: [
      { kind: 'youtube', label: 'Demo', href: 'https://www.youtube.com/watch?v=v-cOBYdeZMY' },
      { kind: 'github', label: 'Github', href: 'https://github.com/3-rt/TakeOne' },
      { kind: 'devpost', label: 'Devpost', href: 'https://devpost.com/software/takeone-erqv3l' },
    ],
  },
  {
    id: 'makecu-2025',
    name: 'MakeCU 2025',
    date: 'Nov 8th – 9th, 2025',
    place: 'New York, New York',
    mark: { text: 'CU', bg: '#1d4f91', fg: '#ffffff' },
    won: true,
    project: 'AutoDump',
    projectId: 'autodump',
    lines: [
      'Built "AutoDump", an autonomous self-emptying trash rover. A Raspberry Pi uses OpenCV and ArUco markers to find a full bin, ultrasonic sensing guides the approach, and microcontroller code docks the rover and dumps it into a central can.',
    ],
    wins: ['3rd Place Overall'],
    links: [
      { kind: 'github', label: 'Github', href: 'https://github.com/RyanQin24/MakeCU' },
      { kind: 'devpost', label: 'Devpost', href: 'https://devpost.com/software/autodump-autonomous-self-emptying-trash-rover' },
    ],
  },
  {
    id: 'uofthacks-12',
    name: 'UofTHacks 12',
    date: 'Jan 17th – 19th, 2025',
    place: 'Toronto, Ontario',
    icon: 'logos/uofthacks.png',
    won: false,
    project: 'Baymax Bot',
    projectId: 'baymax-bot',
    lines: [
      'Built "Baymax Bot", a 3D-printed companion-care robot. A Raspberry Pi handles voice and camera input with emotion detection, connected to a React / Flask app with LLM, vision, Firebase and Auth0 services.',
    ],
    wins: [],
    links: [{ kind: 'story', label: 'DoraHacks', href: 'https://dorahacks.io/buidl/21720' }],
  },
  {
    id: 'htn-2024',
    name: 'Hack the North 2024',
    date: 'Sep 13th – 15th, 2024',
    place: 'Waterloo, Ontario',
    icon: 'logos/htn.png',
    won: false,
    project: 'XRSZE',
    projectId: 'xrsze',
    lines: [
      'Built "XRSZE" ("we can\'t spell exercise, but we can get you to exercise"). MediaPipe pose tracking with a calibrated rep counter, plus a Groq-powered workout and meal-planning coach.',
    ],
    wins: [],
    links: [
      { kind: 'github', label: 'Github', href: 'https://github.com/Zwc-11/XRSZE-Hack-the-North-2024-Public' },
      { kind: 'devpost', label: 'Devpost', href: 'https://devpost.com/software/xrsze' },
    ],
  },
  {
    id: 'jamhacks-8',
    name: 'JamHacks 8',
    date: 'Jun 2024',
    place: 'Waterloo, Ontario',
    icon: 'logos/jamhacks.png',
    won: true,
    project: 'Automatic Modular Watering System',
    projectId: 'jamhacks8',
    lines: [
      'Built a modular plant-watering system with Arduino, C++ and integrated sensors. Each module can be configured for a different plant instead of one fixed watering routine.',
    ],
    wins: ['Best Hardware Award'],
    links: [
      { kind: 'youtube', label: 'Demo', href: 'https://www.youtube.com/watch?v=nycreUS2ojM' },
      { kind: 'youtube', label: 'Award', href: 'https://www.youtube.com/watch?v=u3dLvmsocYU' },
    ],
  },
]

// Project cards: cover art + the text shown on the card.
export type Cover =
  | { kind: 'photo'; src: string; position?: string }
  | { kind: 'framed'; src: string; from: string; to: string; position?: string }

export type ProjectCard = {
  id: string
  name: string
  date: string
  cover: Cover
  blurb: string
  badge?: string
  links: CardLink[]
}

const gh = (repo: string) => `https://github.com/Zwc-11/${repo}`

export const projectCards: ProjectCard[] = [
  {
    id: 'takeone', name: 'TakeOne', date: 'Sep 2026', badge: 'Hack the North Finalist',
    cover: { kind: 'photo', src: 'takeone/rig-front.jpg', position: '50% 28%' },
    blurb: 'An AI director with a robot crew. A voice agent turns a described scene into a typed shot plan, Python validates and rehearses it in simulation, then two robot arms on a cart move the camera and light to film it.',
    links: [
      { kind: 'youtube', label: 'Demo', href: 'https://www.youtube.com/watch?v=v-cOBYdeZMY' },
      { kind: 'github', label: 'Source', href: 'https://github.com/3-rt/TakeOne' },
      { kind: 'devpost', label: 'Devpost', href: 'https://devpost.com/software/takeone-erqv3l' },
    ],
  },
  {
    id: 'hindsight', name: 'Hindsight', date: 'Jun 2026',
    cover: { kind: 'framed', src: 'projects/media/hindsight-tearsheet.png', from: '#3b2a12', to: '#c98a2e' },
    blurb: 'A leakage-audited backtesting engine in Rust, C++, Python and React. Point-in-time data, purged walk-forward splits and run manifests catch the ways a backtest lies.',
    links: [{ kind: 'github', label: 'Source', href: gh('Hindsight') }],
  },
  {
    id: 'murmur', name: 'Murmur', date: 'May 2026',
    cover: { kind: 'framed', src: 'projects/murmur-trace-viewer.png', from: '#21183f', to: '#7a5cd6' },
    blurb: 'A contract-first reliability harness for agents. Independent attempts, task-specific validation, failure classes and hash-chained traces, gated in CI with deterministic replay.',
    links: [{ kind: 'github', label: 'Source', href: gh('Murmur-ai-harness') }],
  },
  {
    id: 'agentreplay', name: 'AgentReplay', date: '2026',
    cover: { kind: 'framed', src: 'projects/agentreplay-calendar.png', from: '#0f2a46', to: '#3f8ee0' },
    blurb: 'Record, replay and diff browser agents. Recorded events compile into a workflow graph, and a React Flow dashboard shows the first step where the agent diverged from a human.',
    links: [{ kind: 'github', label: 'Source', href: gh('agentreplay') }],
  },
  {
    id: 'marketimmune', name: 'MarketImmune', date: '2026',
    cover: { kind: 'framed', src: 'projects/mi-command.png', from: '#0e2f2a', to: '#2fa889' },
    blurb: 'A market-safety benchmark for autonomous trading agents. A six-agent investigation loop, CatBoost detectors on BTC perpetuals and an append-only decision trail in a React / Django dashboard.',
    links: [{ kind: 'github', label: 'Source', href: gh('Marketimmune') }],
  },
  {
    id: 'chaoswing', name: 'ChaosWing', date: '2026',
    cover: { kind: 'framed', src: 'projects/chaoswing-live.png', from: '#1a1d45', to: '#5865f2' },
    blurb: 'Two-stage search for related prediction markets: a bi-encoder retrieves candidates and a fine-tuned cross-encoder reranks them, evaluated on time-safe splits for quality and p95 latency.',
    links: [
      { kind: 'website', label: 'Website', href: 'https://chaoswing.onrender.com' },
      { kind: 'github', label: 'Source', href: gh('Chaoswing') },
    ],
  },
  {
    id: 'autodump', name: 'AutoDump', date: 'Nov 2025', badge: 'MakeCU 3rd Overall',
    cover: { kind: 'photo', src: 'projects/media/autodump-navigation-thumb.jpg', position: '50% 55%' },
    blurb: 'An autonomous trash rover that finds full bins with OpenCV and ArUco markers, docks using ultrasonic sensing, and empties itself into a central can.',
    links: [
      { kind: 'github', label: 'Source', href: 'https://github.com/RyanQin24/MakeCU' },
      { kind: 'devpost', label: 'Devpost', href: 'https://devpost.com/software/autodump-autonomous-self-emptying-trash-rover' },
    ],
  },
  {
    id: 'baymax-bot', name: 'Baymax Bot', date: 'Jan 2025',
    cover: { kind: 'framed', src: 'projects/media/baymax-bot.png', from: '#3d1414', to: '#e0605a' },
    blurb: 'A 3D-printed companion-care robot on a Raspberry Pi with voice, emotion vision and a React / Flask companion app.',
    links: [{ kind: 'story', label: 'DoraHacks', href: 'https://dorahacks.io/buidl/21720' }],
  },
  {
    id: 'quant-portfolio', name: 'Quant Portfolio', date: 'Nov 2024', badge: '1st Place',
    cover: { kind: 'framed', src: 'projects/quant-repo.png', from: '#18241c', to: '#5f8f61' },
    blurb: 'A Python portfolio optimizer with MPT, CAPM and Monte Carlo sampling that outputs share counts after currency and fees. 1st place in Waterloo CS & Finance\'s quant competition.',
    links: [{ kind: 'github', label: 'Source', href: gh('Quantitative-Portfolio-Management-Strategy') }],
  },
  {
    id: 'xrsze', name: 'XRSZE', date: 'Sep 2024',
    cover: { kind: 'framed', src: 'projects/media/xrsze-640.png', from: '#3a1d0b', to: '#f08a3c' },
    blurb: 'A computer-vision rep counter built at Hack the North 2024: MediaPipe pose tracking plus a Groq-powered AI coach.',
    links: [
      { kind: 'github', label: 'Source', href: gh('XRSZE-Hack-the-North-2024-Public') },
      { kind: 'devpost', label: 'Devpost', href: 'https://devpost.com/software/xrsze' },
    ],
  },
  {
    id: 'jamhacks8', name: 'Modular Watering', date: 'Jun 2024', badge: 'Best Hardware',
    cover: { kind: 'photo', src: 'projects/media/biotron-demo.jpg', position: '50% 50%' },
    blurb: 'A sensor-driven, configurable plant-watering system built with Arduino and C++ that won Best Hardware at JamHacks 8.',
    links: [{ kind: 'youtube', label: 'Demo', href: 'https://www.youtube.com/watch?v=nycreUS2ojM' }],
  },
]

export const orgLogos: Record<string, string> = {
  ecobee: 'logos/ecobee.png',
  gore: 'logos/gore.png',
}

export const education = {
  school: 'University of Waterloo',
  logo: 'logos/waterloo.png',
  program: 'Bachelor of Computer Science and Finance (CFM), Co-op',
  period: '2024 – present',
  items: [
    { title: '1st Place, Quantitative Portfolio Management', sub: 'CS & Finance Program, Waterloo', date: 'Nov 2024' },
    { title: 'Canadian Computing Competition (Senior), Top 25%', sub: 'CEMC, University of Waterloo', date: 'Feb 2024' },
    { title: 'Diamond Challenge Summit Finalist', sub: 'FLASH: a social platform blending software with offline events', date: 'Jan 2023' },
    { title: 'FRC Robotics CAD Lead · VEX IQ Club Co-founder', sub: 'Georges Vanier Secondary School · STEM+', date: 'High school' },
  ],
}
