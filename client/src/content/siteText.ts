// Plain-text versions of the site, generated at build time from the same content
// the page renders. They give crawlers, agents and no-JS visitors the full page
// without running React: /llms.txt (Markdown) and static HTML inside #root.
import metadata from './projectMetadata.json'
import { caseStudies } from './caseStudies'
import { experience } from './experience'
import { education, hackathons, projectCards } from './onepage'
import { profile } from './profile'

const site = 'https://caesarzhou.com'
const caseUrl = (id: string) => `${site}/?project=${id}`
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const intro = "Caesar Zhou is a 2B Computer Science & Finance student at the University of Waterloo, currently an AI Adoption & Deployment Engineering Intern (Forward-Deployed AI) at ecobee, and building TakeOne, an OpenAI-supported AI robot film studio that started at Hack the North 2026."

export function siteMarkdown(): string {
  const lines = [
    '# Caesar Zhou', '', `> ${intro}`, '',
    `Email: ${profile.email}`,
    ...profile.socials.map(s => `${s.label}: ${s.href}`), '',
    '## Experience', '',
    ...experience.map(r => `- ${r.org}, ${r.role} (${r.period}): ${r.highlight}`), '',
    '## Projects', '',
    ...projectCards.map(p => `- [${p.name}](${caseUrl(p.id)}) (${p.date}${p.award ? `, ${p.award}` : ''}): ${caseStudies[p.id].overview}`), '',
    '## Hackathons', '',
    ...hackathons.map(h => `- ${h.name} (${h.date}): ${h.project}${h.award ? `, ${h.award}` : ''}`), '',
    '## Education', '',
    `- ${education.school}, ${education.program} (${education.period})`,
    `- ${education.award.title} (${education.award.date})`, '',
    '## Case studies', '',
  ]
  for (const p of metadata.projects) {
    const s = caseStudies[p.id]
    lines.push(`### ${p.name}`, '', s.overview, '', `${s.ownership} · ${p.year}${p.award ? ` · ${p.award}` : ''}`, '',
      s.contribution, '', `Stack: ${p.tags.join(', ')}`, '',
      ...s.decisions.map(d => `- ${d.title}: ${d.detail}`), '',
      `Scope: ${s.evidence} ${s.scope}`, '',
      ...p.links.map(l => `- ${l.label}: ${l.href}`), '')
  }
  return lines.join('\n')
}

export function siteHtml(): string {
  const li = (s: string) => `<li>${s}</li>`
  return `<main class="static-site"><h1>Caesar Zhou</h1><p>${esc(intro)}</p>`
    + `<p><a href="mailto:${profile.email}">${profile.email}</a> · ${profile.socials.map(s => `<a href="${s.href}">${s.label}</a>`).join(' · ')}</p>`
    + `<h2>Experience</h2><ul>${experience.map(r => li(`<strong>${esc(r.org)}</strong>, ${esc(r.role)} (${r.period}). ${esc(r.highlight)}`)).join('')}</ul>`
    + `<h2>Projects</h2><ul>${projectCards.map(p => li(`<a href="?project=${p.id}">${esc(p.name)}</a>${p.award ? ` (${esc(p.award)})` : ''}: ${esc(caseStudies[p.id].overview)}`)).join('')}</ul>`
    + `<h2>Hackathons</h2><ul>${hackathons.map(h => li(`${esc(h.name)}: ${esc(h.project)}${h.award ? `, ${esc(h.award)}` : ''}`)).join('')}</ul>`
    + `<h2>Education</h2><ul>${li(`${esc(education.school)}, ${esc(education.program)}`)}${li(esc(education.award.title))}</ul>`
    + `<p><a href="llms.txt">Full text with every case study</a></p></main>`
}

export function personJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: site,
    email: `mailto:${profile.email}`,
    jobTitle: 'AI Adoption & Deployment Engineering Intern (Forward-Deployed AI)',
    worksFor: { '@type': 'Organization', name: 'ecobee' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
    sameAs: profile.socials.map(s => s.href),
  })
}
