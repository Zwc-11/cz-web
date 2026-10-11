// Single source of truth for who Caesar is. Everything here is taken from
// the September 2026 résumé; every metric on the site must trace back to
// a line in that résumé or a public page.

export const profile = {
  name: 'Caesar Zhou',
  role: 'Forward Deployed Engineering Intern at ecobee',
  headline: 'Forward Deployed Engineer · AI systems · Software',
  location: 'Toronto, ON',
  timeZone: 'America/Toronto',
  email: 'caesar.zwc.0611@gmail.com',
  resume: 'resume.pdf',
  avatar: 'avatar.jpg',
  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/Zwc-11' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/caesar-zhou-487558249' },
    { id: 'devpost', label: 'Devpost', href: 'https://devpost.com/Caesarz' },
  ],
  education: {
    school: 'University of Waterloo',
    program: 'Bachelor of Computer Science and Finance (CFM), Co-op',
    period: '2024 – present',
  },
  skills: [
    { group: 'AI systems & agents', items: ['Claude', 'MCP', 'LangGraph', 'RAG evaluation', 'Agent harnesses', 'PyTorch', 'CatBoost', 'MLflow'] },
    { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C++'] },
    { group: 'Backend, APIs & web', items: ['FastAPI', 'Django', 'Flask', 'Node.js', 'React', 'Playwright', 'React Flow'] },
    { group: 'Data & infrastructure', items: ['BigQuery', 'PostgreSQL', 'DuckDB', 'Polars', 'Databricks', 'Docker', 'GitHub Actions', 'Azure'] },
    { group: 'Computer vision & embedded', items: ['OpenCV', 'MediaPipe', 'MuJoCo', 'ESP32', 'Raspberry Pi', 'Arduino'] },
  ],
} as const
