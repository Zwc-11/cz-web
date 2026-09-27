// Single source of truth for who Caesar is. Everything here is taken from
// the September 2026 résumé; every metric on the site must trace back to
// a line in that résumé or a public page.

export const profile = {
  name: 'Caesar Zhou',
  role: 'Forward Deployed Engineering Intern at ecobee',
  location: 'Toronto, ON',
  timeZone: 'America/Toronto',
  email: 'caesar.zwc.0611@gmail.com',
  resume: 'resume.pdf',
  avatar: 'avatar.jpg',
  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/Zwc-11' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/caesar-zhou-487558249' },
    { id: 'devpost', label: 'Devpost', href: 'https://devpost.com/caesar-zwc-0611' },
  ],
  education: {
    school: 'University of Waterloo',
    program: 'Bachelor of Computer Science and Finance (CFM), Co-op',
    period: '2024 – present',
  },
  skills: [
    { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C++'] },
    { group: 'AI & machine learning', items: ['LangGraph', 'MCP', 'RAG evaluation', 'PyTorch', 'CatBoost', 'MLflow', 'OpenCV', 'MediaPipe'] },
    { group: 'Web & APIs', items: ['React', 'FastAPI', 'Django', 'Flask', 'Node.js', 'Playwright', 'React Flow'] },
    { group: 'Data & infrastructure', items: ['BigQuery', 'PostgreSQL', 'DuckDB', 'Polars', 'Docker', 'GitHub Actions', 'Azure', 'Databricks'] },
  ],
} as const
