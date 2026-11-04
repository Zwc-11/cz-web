// Homepage content: hackathons, project cards, the featured carousel and education.
// Facts come from Devpost and the project case studies.

export type Hackathon = {
  id: string
  name: string
  date: string
  icon?: string // path under /public
  mark?: { text: string; bg: string; fg: string } // fallback tile when there is no logo
  project: string
  projectId: string // case study id
  award?: string
}

// Newest first.
export const hackathons: Hackathon[] = [
  { id: 'lahacks-ai-2026', name: 'LA Hacks 2026', date: 'Oct 2026', icon: 'logos/lahacks.png', project: 'SproutPass', projectId: 'sproutpass', award: 'Visa Challenge Winner' },
  { id: 'htn-2026', name: 'Hack the North 2026', date: 'Sep 2026', icon: 'logos/htn.png', project: 'TakeOne', projectId: 'takeone', award: 'Top-scoring finalist' },
  { id: 'makecu-2025', name: 'MakeCU 2025', date: 'Nov 2025', mark: { text: 'CU', bg: '#1d4f91', fg: '#ffffff' }, project: 'AutoDump', projectId: 'autodump', award: '3rd Place Overall' },
  { id: 'uofthacks-12', name: 'UofTHacks 12', date: 'Jan 2025', icon: 'logos/uofthacks.png', project: 'Baymax Bot', projectId: 'baymax-bot' },
  { id: 'htn-2024', name: 'Hack the North 2024', date: 'Sep 2024', icon: 'logos/htn.png', project: 'XRSZE', projectId: 'xrsze' },
  { id: 'jamhacks-8', name: 'JamHacks 8', date: 'Jun 2024', icon: 'logos/jamhacks.png', project: 'Modular Watering', projectId: 'jamhacks8', award: 'Best Hardware' },
]

// Project cards: cover art and award. The one-line description is caseStudies[id].overview.
export type Cover =
  | { kind: 'photo'; src: string; position?: string }
  | { kind: 'framed'; src: string; from: string; to: string; position?: string }
  | { kind: 'video'; src: string; webm?: string; poster: string } // short muted loop, plays while on screen

export type ProjectCard = {
  id: string
  name: string
  date: string
  cover: Cover
  award?: string // shown on the cover
  featured?: boolean // shown on the homepage; every card keeps its case study
}

// Newest first. Same-month entries are ordered by when work started (first repository
// commit); scripts/project-navigation.test.mjs checks the order.
export const projectCards: ProjectCard[] = [
  {
    id: 'daycube', name: 'DayCube', date: 'Nov 2026', featured: true,
    cover: { kind: 'video', src: 'projects/media/daycube-app-cover.mp4', webm: 'projects/media/daycube-app-cover.webm', poster: 'projects/media/daycube-app-cover.jpg' },
  },
  {
    id: 'marketimmune', name: 'MarketImmune', date: 'Nov 2026', featured: true,
    cover: { kind: 'video', src: 'projects/media/marketimmune-cover.mp4', webm: 'projects/media/marketimmune-cover.webm', poster: 'projects/media/marketimmune-cover.jpg' },
  },
  {
    id: 'sproutpass', name: 'SproutPass', date: 'Oct 2026', award: 'Visa Challenge Winner', featured: true,
    cover: { kind: 'photo', src: 'projects/media/sproutpass-cover-thumb.jpg', position: '50% 50%' },
  },
  {
    id: 'takeone', name: 'TakeOne', date: 'Sep 2026', award: 'Hack the North Finalist', featured: true,
    cover: { kind: 'photo', src: 'takeone/rig-ring.jpg', position: '50% 0%' },
  },
  {
    id: 'hindsight', name: 'Hindsight', date: 'Jun 2026',
    cover: { kind: 'framed', src: 'projects/media/hindsight-tearsheet.png', from: '#3b2a12', to: '#c98a2e' },
  },
  {
    id: 'agentreplay', name: 'AgentReplay', date: 'Jun 2026',
    cover: { kind: 'framed', src: 'projects/agentreplay-calendar.png', from: '#0f2a46', to: '#3f8ee0' },
  },
  {
    id: 'murmur', name: 'Murmur', date: 'May 2026', featured: true,
    cover: { kind: 'framed', src: 'projects/murmur-trace-viewer.png', from: '#21183f', to: '#7a5cd6' },
  },
  {
    id: 'chaoswing', name: 'ChaosWing', date: 'Mar 2026', featured: true,
    cover: { kind: 'framed', src: 'projects/chaoswing-live.png', from: '#1a1d45', to: '#5865f2' },
  },
  {
    id: 'autodump', name: 'AutoDump', date: 'Nov 2025', award: 'MakeCU 3rd Overall',
    cover: { kind: 'photo', src: 'projects/media/autodump-navigation-thumb.jpg', position: '50% 55%' },
  },
  {
    id: 'baymax-bot', name: 'Baymax Bot', date: 'Jan 2025',
    cover: { kind: 'framed', src: 'projects/media/baymax-bot.png', from: '#3d1414', to: '#e0605a' },
  },
  {
    id: 'quant-portfolio', name: 'Quant Portfolio', date: 'Nov 2024', award: '1st Place',
    cover: { kind: 'framed', src: 'projects/quant-repo.png', from: '#18241c', to: '#5f8f61' },
  },
  {
    id: 'xrsze', name: 'XRSZE', date: 'Sep 2024',
    cover: { kind: 'framed', src: 'projects/media/xrsze-640.png', from: '#3a1d0b', to: '#f08a3c' },
  },
  {
    id: 'jamhacks8', name: 'Modular Watering', date: 'Jun 2024', award: 'Best Hardware',
    cover: { kind: 'photo', src: 'projects/media/biotron-demo.jpg', position: '50% 50%' },
  },
]

// Hack the North 2026 photos for the carousel under the intro.
export type Slide = { src: string; alt: string }
export const featureSlides: Slide[] = [
  { src: 'photos/htn-2026-finals-demo.jpg', alt: 'The TakeOne team demoing the robotic camera and lighting rig on stage at the Hack the North 2026 finals' },
  { src: 'photos/htn-2026-finals-pitch.jpg', alt: 'The TakeOne team pitching with a microphone beside the ring light and camera rig at the Hack the North 2026 finals' },
  { src: 'photos/htn-2026-building.jpg', alt: 'A TakeOne team member crouched beside the robot cart with a laptop, tuning the arms during the hackathon' },
]

export const education = {
  school: 'University of Waterloo',
  logo: 'logos/waterloo.png',
  program: 'Computer Science & Finance (CFM), Co-op',
  period: '2024 – present',
  award: { title: '1st Place, Quantitative Portfolio Management', projectId: 'quant-portfolio', date: 'Nov 2024' },
}
