// Experience written as field reports: who I sat with, what was broken,
// what shipped, what changed. Wording follows the résumé.

export type Deployment = {
  id: string
  org: string
  mark: string // logo tile letter
  markBg: string
  markFg: string
  role: string
  employmentType: 'Internship' | 'Part-time contract'
  period: string
  place: string
  live?: boolean
  embeddedWith: string[]
  problem: string
  shipped: string
  result: string
  stack: string[]
}

export const deployments: Deployment[] = [
  {
    id: 'ecobee',
    org: 'ecobee',
    mark: 'e',
    markBg: 'var(--fg)',
    markFg: 'var(--bg)',
    role: 'Forward Deployed Engineer',
    employmentType: 'Internship',
    period: 'Sep – Dec 2026',
    place: 'Toronto · Hybrid',
    live: true,
    embeddedWith: ['Finance Modeling', 'Accounting', 'Sales'],
    problem:
      'Close, reconciliation, reporting and sales processes ran on manual steps that nobody had mapped end to end.',
    shipped:
      '30+ tools, 15+ agents and 25+ reusable AI skills in Python, Claude and MCP, wired into Excel, BigQuery and internal APIs with structured contracts, deterministic controls and human approval.',
    result:
      'Pilots moved onto shared AI infrastructure with telemetry, governance and health checks. Users save 2+ hours of manual work per day.',
    stack: ['Python', 'Claude', 'MCP', 'BigQuery', 'Excel', 'API integration', 'Telemetry'],
  },
  {
    id: 'wdi',
    org: 'Wealthy Doctor Institute',
    mark: 'W',
    markBg: '#1f5c4a',
    markFg: '#ffffff',
    role: 'Full-Stack AI Engineer',
    employmentType: 'Part-time contract',
    period: 'Jun – Aug 2026',
    place: 'Remote · United States',
    embeddedWith: ['Founders', 'Marketing'],
    problem:
      'Research, SEO/GEO, lead qualification and content for a physician-finance business were all done by hand.',
    shipped:
      'An end-to-end agentic marketing platform on DeepSeek, GLM and Llama with agent harnesses, plus the data, analytics and governance layer: MCP, Databricks-ready ingestion, dashboards, reviewer controls, traceable workflows.',
    result: 'Helped the business acquire 70+ clients. The advertising agent lifted weekly website traffic by 82%.',
    stack: ['DeepSeek', 'GLM', 'Llama', 'MCP', 'Databricks-ready pipelines', 'Agent harnesses'],
  },
  {
    id: 'gore',
    org: 'Gore Mutual Insurance',
    mark: 'G',
    markBg: '#b3262d',
    markFg: '#ffffff',
    role: 'Data Scientist & AI Platform Engineer',
    employmentType: 'Internship',
    period: 'Jan – Apr 2026',
    place: 'Cambridge, ON · Hybrid',
    embeddedWith: ['Underwriting', 'Actuarial'],
    problem: 'Underwriters had to search 100+ page policy documents to answer routine questions.',
    shipped:
      'A LangGraph RAG system, tuned by ablating 5+ parsing and chunking schemes and 8+ retrieval pipelines on 200+ labeled questions. Plus a ReAct analytics harness with 8 composable tools, and frequency-severity GLMs with causal inference across 4 policyholder cohorts.',
    result: '89.5% strict / 92.1% lenient accuracy, with evaluation runtime cut by 80%.',
    stack: ['Python', 'LangGraph', 'RAG evaluation', 'ReAct', 'GLMs', 'Causal inference'],
  },
  {
    id: 'csaa',
    org: 'Canadian STEM and AI Academy',
    mark: 'C',
    markBg: '#2c4a8a',
    markFg: '#ffffff',
    role: 'Robotics & Software Developer',
    employmentType: 'Internship',
    period: 'Apr – Aug 2025',
    place: 'Markham, ON',
    embeddedWith: ['FRC teams', 'VEX teams'],
    problem: 'Student robotics teams lost build time to robot bring-up and repeated STM32 and Arduino setup.',
    shipped: 'Developed and taught C++ robotics software covering PID control, robot bring-up and embedded workflows.',
    result: 'Tooling that streamlined STM32 and Arduino development for the teams.',
    stack: ['C++', 'PID', 'STM32', 'Arduino'],
  },
]
