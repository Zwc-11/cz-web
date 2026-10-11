// TakeOne (featured), other projects, and hackathons.

export const takeone = {
  name: 'TakeOne',
  kicker: 'Embodied AI agent · Hack the North 2026',
  award: 'Hack the North 2026 · Finalist', // Devpost lists the prize as "Hack the North 2026: Finalists"
  date: 'Sep 2026',
  summary:
    'An AI director with a robot crew. You describe the shot; a voice agent and AI director turn it into a structured camera plan, Python validates and rehearses it in simulation, then a cart with two robot arms moves the camera and the light to film it.',
  team: ['Ryan Qin', 'Basil Liu'],
  links: {
    demo: 'https://www.youtube.com/watch?v=v-cOBYdeZMY',
    github: 'https://github.com/3-rt/TakeOne',
    devpost: 'https://devpost.com/software/takeone-erqv3l',
  },
  stats: [
    { value: '2 s → 40 ms', label: 'preview compile time' },
    { value: '39', label: 'movement presets' },
    { value: '2', label: 'SO-101 arms on one cart' },
    { value: '0', label: 'brownouts in testing' },
  ],
  // Camera "feeds" for the monitor. Replace with the full-resolution
  // originals from the Devpost gallery before launch (see README).
  cams: [
    { id: 'A', label: 'Rig', src: 'takeone/rig-front.jpg', focus: '50% 22%', subject: { x: 0.47, y: 0.3 } },
    { id: 'B', label: 'Sim', src: 'takeone/sim.jpg', focus: '50% 50%', subject: { x: 0.55, y: 0.43 } },
    { id: 'C', label: 'Light', src: 'takeone/rig-ring.jpg', focus: '50% 18%', subject: { x: 0.24, y: 0.3 } },
    { id: 'D', label: 'Top', src: 'takeone/rig-top.jpg', focus: '50% 30%', subject: { x: 0.5, y: 0.36 } },
  ],
  pipeline: [
    {
      id: 'describe',
      step: 'Describe',
      title: 'Say the shot out loud',
      body: 'A creator describes the scene in plain language. A live voice agent asks follow-ups through constrained function calls instead of free-form chat.',
      tech: ['Voice agent', 'Function calling'],
    },
    {
      id: 'plan',
      step: 'Plan',
      title: 'Script to camera plan',
      body: 'The AI director converts scripts and voice into task-space camera plans: framing, lens, movement, light position and performance cues as structured output.',
      tech: ['Structured outputs', 'Python'],
    },
    {
      id: 'rehearse',
      step: 'Rehearse',
      title: 'Check it in simulation first',
      body: 'Python validates and compiles each movement plan. MuJoCo supplies the robot geometry for IK/FK, joint limits and clearance checks; Three.js shows the rehearsal. Preview compile went from about 2 s to about 40 ms.',
      tech: ['MuJoCo', 'Three.js', 'IK/FK'],
    },
    {
      id: 'film',
      step: 'Film',
      title: 'Robots move, a human approves',
      body: 'An ESP32 and CAN bus drive the differential-drive cart while two SO-101 arms carry the camera and the light. OpenCV, MediaPipe and PID keep the performer framed. Nothing moves without operator approval.',
      tech: ['ESP32', 'CAN bus', 'LeRobot SO-101', 'MediaPipe'],
    },
    {
      id: 'edit',
      step: 'Edit',
      title: 'From takes to a cut',
      body: 'Recorded takes land in a React editor for trimming, pacing and transitions. FFmpeg renders previews and exports, and the AI proposes edits.',
      tech: ['React', 'FFmpeg'],
    },
  ],
} as const

export type Project = {
  id: string
  name: string
  tagline: string
  period: string
  art: 'hindsight' | 'murmur' | 'marketimmune' | 'agentreplay'
  tags: string[]
  summary: string
  points: string[]
  href: string
}

export const projects: Project[] = [
  {
    id: 'hindsight',
    name: 'Hindsight',
    tagline: 'Leakage-audited backtesting engine',
    period: 'Jun 2026 – now',
    art: 'hindsight',
    tags: ['Rust', 'C++', 'Python', 'React', 'PyArrow', 'pytest', 'Ruff'],
    summary:
      'A quant research and backtesting platform built to catch the ways a backtest lies: look-ahead leakage, non-point-in-time data, and results you cannot reproduce.',
    points: [
      'Cross-language platform in Rust, C++, Python and React with deterministic replay, point-in-time data, event-driven execution and leakage checks.',
      'Autonomous global data-ingestion pipeline across CKAN, STAC, SDMX, OpenAPI, OGC and JSON-LD, normalizing 7,355 observations across 98 series with provenance and revision tracking.',
    ],
    href: 'https://github.com/Zwc-11/Hindsight',
  },
  {
    id: 'murmur',
    name: 'Murmur',
    tagline: 'Validation harness for financial-document agents',
    period: 'May 2026 – now',
    art: 'murmur',
    tags: ['Python', 'LangGraph', 'DeepSeek', 'Qwen', 'pytest', 'OpenTelemetry', 'GitHub Actions', 'Docker'],
    summary:
      'A truth-blind validation environment for agents that read financial documents: every run leaves evidence, a budget trail and a receipt you can replay.',
    points: [
      'Redesigned an open-source coding-agent reliability harness into a validation environment with budgeted evidence checks, correlated attempts and replayable decision receipts.',
      'GitHub Actions gates on 30-attempt baseline suites with hash-chained traces, labeled artifacts, a committed DeepSeek run, budget tracking and deterministic CI replay.',
    ],
    href: 'https://github.com/Zwc-11/Murmur-ai-harness',
  },
  {
    id: 'marketimmune',
    name: 'MarketImmune',
    tagline: 'Market-safety benchmark for trading agents',
    period: '2026',
    art: 'marketimmune',
    tags: ['Python', 'Django', 'CatBoost', 'scikit-learn', 'PyTorch', 'React', 'TypeScript', 'Hyperliquid API'],
    summary:
      'A benchmark platform for detecting harmful behaviour from autonomous trading agents, built on market-structure alerts benchmarked against BTC perpetual futures.',
    points: [
      'Scores agent order flow for toxic and manipulative patterns instead of making trading claims.',
      'CatBoost detectors evaluated on BTC perpetual-futures data.',
    ],
    href: 'https://github.com/Zwc-11/Marketimmune',
  },
  {
    id: 'agentreplay',
    name: 'AgentReplay',
    tagline: 'Record, replay and diff browser agents',
    period: '2026',
    art: 'agentreplay',
    tags: ['TypeScript', 'Python', 'Playwright', 'FastAPI', 'React Flow', 'PostgreSQL', 'Redis', 'Docker'],
    summary: 'Browser workflow replay and failure analysis for agent testing: record a run, replay it, and see exactly where it diverged.',
    points: [
      'Captures a bundled browser workflow so an agent run can be replayed step by step.',
      'Highlights the first divergence between a recorded run and a replay.',
    ],
    href: 'https://github.com/Zwc-11/agentreplay',
  },
]

export type Hackathon = {
  event: string
  date: string
  project: string
  line: string
  award?: string
  href?: string
  hardware?: boolean
}

export const hackathons: Hackathon[] = [
  { event: 'Hack the North 2026', date: 'Sep 2026', project: 'TakeOne', hardware: true, line: 'Robotic film studio with an AI director', award: 'Finalist', href: 'https://devpost.com/software/takeone-erqv3l' },
  { event: 'MakeCU 2025', date: 'Nov 2025', project: 'AutoDump', hardware: true, line: 'Trash rover that finds full bins and empties itself', award: '3rd Place Overall', href: 'https://devpost.com/software/autodump-autonomous-self-emptying-trash-rover' },
  { event: 'JamHacks 8', date: 'Jun 2024', project: 'Modular Watering', hardware: true, line: 'Sensor-driven, configurable plant watering', award: 'Best Hardware', href: 'https://www.youtube.com/watch?v=nycreUS2ojM' },
  { event: 'UofTHacks 12', date: 'Jan 2025', project: 'Baymax Bot', hardware: true, line: '3D-printed companion-care robot with emotion vision', href: 'https://dorahacks.io/buidl/21720' },
  { event: 'Hack the North 2024', date: 'Sep 2024', project: 'XRSZE', line: 'Computer-vision rep counter with an AI coach', href: 'https://devpost.com/software/xrsze' },
]
