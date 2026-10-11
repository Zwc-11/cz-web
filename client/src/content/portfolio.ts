import metadata from './projectMetadata.json'
import { deployments } from './deployments'
import { caseStudies } from './caseStudies'

export type Work = {
  id: string; name: string; category: 'AI & agents' | 'Data & ML systems' | 'Applied AI'; year: string;
  tagline: string; summary: string; problem: string; approach: string; result: string;
  tags: readonly string[]; links: { label: string; href: string }[];
  image?: string; caption?: string; event?: string; award?: string;
}

export const experience = [...deployments, {
  id: 'brandeq', org: 'BrandEQ Group', mark: 'B', markBg: '#624d74', markFg: '#fff',
  role: 'Website Developer', period: 'Apr – Aug 2023', place: 'Toronto · Hybrid',
  employmentType: 'Internship',
  embeddedWith: ['Clients', 'Student development team'],
  problem: 'Community organisations needed websites that reflected their work and served their audiences.',
  shipped: 'Led a team of high-school students through client meetings, design and development. Delivered websites for the Lifelong Leadership Institute, BossWomen and the BBPA.',
  result: 'Recognized by CEO Nadine Spencer for creative direction and client results.',
  stack: ['Web development', 'Client discovery', 'Team leadership'],
}].map(e => e.id === 'csaa' ? {...e, period: '2025', shipped: 'Coached FRC and VEX students in CAD, robot bring-up and C++ PID control. Built a React, Electron and Python firmware/SDK generator to reduce repeated STM32 and Arduino setup.', stack: ['React', 'Electron', 'Python', 'C++', 'PID', 'CAD', 'STM32', 'Arduino'] } : e)

// Only compact metadata ships in the index. Historical prose stays in archive.json.
// The same case-study copy feeds project cards, search and the legacy story view.
export const works: Work[] = metadata.projects.map(work => {
  const study = caseStudies[work.id]
  return {
    ...work,
    category: work.category as Work['category'],
    tagline: study.overview,
    summary: study.overview,
    problem: study.overview,
    approach: study.contribution,
    result: study.evidence,
  }
})

export const recognition = metadata.recognition
