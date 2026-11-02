// Work history, newest first. `highlight` is the one line shown on the homepage;
// every figure in it comes from the résumé.

export type Role = {
  id: string
  org: string
  role: string
  period: string
  logo?: string // path under /public
  mark: { text: string; bg: string; fg: string } // fallback tile when there is no logo
  highlight: string
}

export const experience: Role[] = [
  {
    id: 'ecobee',
    org: 'ecobee',
    role: 'AI Adoption & Deployment Engineering Intern (Forward-Deployed AI)',
    period: 'Sep – Dec 2026',
    logo: 'logos/ecobee.png',
    mark: { text: 'e', bg: '#0b3b3c', fg: '#ffffff' },
    highlight: '30+ AI tools, 15+ agents and 25+ reusable skills for finance, accounting and sales. Users save 2+ hours a day.',
  },
  {
    id: 'wdi',
    org: 'Wealthy Doctor Institute',
    role: 'Full-Stack AI Engineer',
    period: 'Jun – Aug 2026',
    mark: { text: 'W', bg: '#1f5c4a', fg: '#ffffff' },
    highlight: 'Built their agentic marketing platform end to end. 70+ clients acquired; weekly site traffic up 82%.',
  },
  {
    id: 'gore',
    org: 'Gore Mutual Insurance',
    role: 'Data Scientist & AI Platform Engineer',
    period: 'Jan – Apr 2026',
    logo: 'logos/gore.png',
    mark: { text: 'G', bg: '#b3262d', fg: '#ffffff' },
    highlight: 'RAG for underwriters: 89.5% strict accuracy on 200+ labeled questions, evaluation runtime cut 80%.',
  },
  {
    id: 'csaa',
    org: 'Canadian STEM and AI Academy',
    role: 'Robotics & Software Developer',
    period: '2025',
    mark: { text: 'C', bg: '#2c4a8a', fg: '#ffffff' },
    highlight: 'Taught C++ robot control to FRC and VEX teams; built a firmware generator for STM32 and Arduino.',
  },
]
