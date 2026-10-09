import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { experience, recognition, works } from '../content/portfolio'
import { profile } from '../content/profile'
import type { TakeId } from '../content/takes'
import type { Theme } from '../hooks/useTheme'
import { IconArrowRight, IconArrowUpRight, IconCopy, IconFile, IconGitHub, IconLinkedIn } from './icons'
import { OrgMark } from './ui'
import { ProjectIndex } from './ProjectIndex'
import { TechnologyTags } from './TechnologyTags'
import { ThemeToggle } from './ThemeToggle'
import { ElementSignature } from './ElementSignature'
import { AnimatedIntro } from './AnimatedIntro'
import { FocusExplorer } from './FocusExplorer'
import { QuickExplore, type ExploreSelection } from './QuickExplore'
import { motion, useReducedMotion } from 'motion/react'

export type Origin = { top: number; left: number; width: number; height: number }
type Section = 'experience' | 'projects'
const sections: Section[] = ['experience', 'projects']
const currentSection = (): Section => new URLSearchParams(window.location.search).get('tab') === 'projects' ? 'projects' : 'experience'

const experienceSummary: Record<string, string> = {
  ecobee: 'Building AI tools for finance, accounting and sales teams.',
  wdi: 'Built an AI marketing platform for research, content and lead qualification.',
  gore: 'Built document search and analytics tools for underwriting and actuarial teams.',
  csaa: 'Developed robotics software and taught FRC and VEX students.',
  brandeq: 'Led a student team delivering websites for community organisations.',
}

export function Home({ theme, onTheme, onOpen, onCopy, onProjectOpen }: {
  theme: Theme
  onTheme: (o?: { x: number; y: number }) => void
  onOpen: (id: TakeId, origin?: Origin) => void
  onCopy: () => void
  onProjectOpen: (id: string) => void
}) {
  const [section, setSection] = useState<Section>(currentSection)
  const [searchRequest, setSearchRequest] = useState<{ query: string; revision: number }>()
  const reduce = useReducedMotion()
  const tabRefs = useRef<Partial<Record<Section, HTMLButtonElement | null>>>({})
  useEffect(() => {
    const sync = () => setSection(currentSection())
    window.addEventListener('popstate', sync)
    window.addEventListener('portfolio:navigate', sync)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('portfolio:navigate', sync) }
  }, [])

  const selectSection = (next: Section, replace = false) => {
    if (next === section) return
    setSection(next)
    const url = new URL(window.location.href)
    if (next === 'experience') url.searchParams.delete('tab')
    else url.searchParams.set('tab', next)
    window.history[replace ? 'replaceState' : 'pushState'](null, '', url)
  }

  const jumpToWork = (selection: ExploreSelection) => {
    if (selection.kind === 'project') { onProjectOpen(selection.id); return }
    selectSection('experience')
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const row = document.getElementById(`${selection.kind}-${selection.id}`)
      const detail = row?.querySelector('details')
      if (detail) detail.open = true
      row?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' })
      row?.querySelector('summary')?.focus({ preventScroll: true })
    }))
  }

  const exploreTechnology = (technology: string) => {
    setSearchRequest(previous => ({ query: technology, revision: (previous?.revision ?? 0) + 1 }))
  }

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, tab: Section) => {
    let next: Section
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = sections[(sections.indexOf(tab) + 1) % sections.length]
    else if (event.key === 'Home') next = 'experience'
    else if (event.key === 'End') next = 'projects'
    else return
    event.preventDefault()
    selectSection(next, true)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="portfolio-shell">
      <a href="#main" className="portfolio-skip">Skip to content</a>
      <header className="portfolio-header">
        <span className="portfolio-name font-mono text-[11px] tracking-[0.1em] text-faint uppercase">Caesar Zhou</span>
        <div className="flex items-center gap-2">
          <QuickExplore onSelect={jumpToWork} searchRequest={searchRequest} />
          <a href={`mailto:${profile.email}?subject=Resume%20request`} className="portfolio-link resume-link" aria-label="Request résumé"><IconFile size={14} /><span className="resume-long">Request résumé</span><span className="resume-short">Résumé</span></a>
          <ThemeToggle theme={theme} onToggle={onTheme} />
        </div>
      </header>

      <main id="main">
        <section aria-labelledby="intro-title" className="portfolio-intro">
          <div className="intro-heading"><AnimatedIntro /><ElementSignature /></div>
          <p className="mt-5 text-[17px] leading-relaxed text-fg sm:text-[19px]">Computer Science & Finance at Waterloo.<br />Currently a Forward Deployed Engineering Intern at <button type="button" onClick={() => onOpen('ecobee')} className="link-u">ecobee</button>.</p>
          <p className="mt-4 max-w-[550px] text-[15px] leading-[1.8]">I build software for AI and finance. Outside work, I'm often at hackathons, turning ideas into real products.</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
            <button type="button" onClick={onCopy} className="portfolio-link" aria-label={`Copy email address: ${profile.email}`}><IconCopy size={14} />Email</button>
            <a href={profile.socials[0].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconGitHub size={15} />GitHub</a>
            <a href={profile.socials[1].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconLinkedIn size={15} />LinkedIn</a>
            <a href={profile.socials[2].href} target="_blank" rel="noreferrer noopener" className="portfolio-link">Devpost<IconArrowUpRight size={13} /></a>
          </div>
        </section>

        <details className="focus-route"><summary>Explore by focus: AI, finance, full-stack & hackathons</summary><FocusExplorer onSelect={jumpToWork} /></details>

        <div role="tablist" aria-label="Explore my work" className="portfolio-tabs">
          {sections.map(tab => <button key={tab} type="button" role="tab" id={`tab-${tab}`} aria-selected={section === tab} aria-controls={`panel-${tab}`} tabIndex={section === tab ? 0 : -1}
            ref={el => { tabRefs.current[tab] = el }} onClick={() => selectSection(tab)} onKeyDown={event => onTabKey(event, tab)}>
            {tab === 'experience' ? 'Experience' : 'Projects'}<span aria-hidden="true">{tab === 'experience' ? experience.length : works.length}</span>
            {section === tab && <motion.span className="portfolio-tab-indicator" layoutId="portfolio-tab-indicator" aria-hidden="true" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} />}
          </button>)}
        </div>

        <section id="panel-experience" role="tabpanel" aria-labelledby="tab-experience" hidden={section !== 'experience'} tabIndex={0} className="portfolio-panel">
          <h2 className="sr-only">Experience</h2>
          <p className="mb-2 text-[12px] text-faint">Internships & part-time contract work</p>
          <ol className="divide-y divide-line">
            {experience.map(d => <motion.li key={d.id} id={`experience-${d.id}`} tabIndex={-1} className="experience-row"
              initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -24px 0px' }} transition={{ duration: reduce ? 0 : .45 }}>
              <div className="experience-mark"><OrgMark mark={d.mark} bg={d.markBg} fg={d.markFg} size={36} /></div>
              <div className="min-w-0">
                <div className="experience-heading">
                  <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-fg">{d.org}</h3>
                  <span className="text-[11.5px] text-faint">{d.period}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-fg">{d.role}</p>
                <p className="mt-1 text-[11.5px]"><span className="growth-ink">{d.employmentType}</span><span className="text-faint"> · {d.place}</span></p>
                <p className="mt-2 text-[13px] leading-[1.7]">{experienceSummary[d.id]}</p>
                <p className="experience-result"><span>Outcome</span>{d.result}</p>
                <TechnologyTags items={d.stack} label={`Tools and skills used at ${d.org}`} onExplore={exploreTechnology} />
                <details className="project-story mt-1">
                  <summary aria-label={`Read about my work at ${d.org}`}>What I worked on</summary>
                  <div className="pb-3"><p>{d.shipped}</p>
                    {d.id === 'ecobee' && <button type="button" onClick={() => onOpen('ecobee')} className="portfolio-link mt-2">Inside my ecobee internship<IconArrowRight size={13}/></button>}
                  </div>
                </details>
              </div>
            </motion.li>)}
          </ol>

          <section aria-labelledby="toolkit-title" className="portfolio-subsection">
            <h2 id="toolkit-title" className="portfolio-section-title">Technical toolkit</h2>
            <p className="mt-2 text-[13px] leading-[1.65]">Tools and methods used across my internships, contract work and projects.</p>
            <div className="toolkit-grid">
              {profile.skills.map(group => <div key={group.group}>
                <h3 className="toolkit-group-title">{group.group}</h3>
                <TechnologyTags items={group.items} label={group.group} onExplore={exploreTechnology} />
              </div>)}
            </div>
          </section>

          <section aria-labelledby="education-title" className="portfolio-subsection">
            <h2 id="education-title" className="portfolio-section-title">Education</h2>
            <div className="experience-heading mt-5"><h3 className="text-[16px] font-semibold text-fg">University of Waterloo</h3><span className="text-[12px] text-faint">2024 – present</span></div>
            <p className="mt-1 text-[14px]">Computing and Financial Management · Co-op</p>
            <button type="button" onClick={() => onOpen('before')} className="portfolio-link mt-3">More about my background<IconArrowRight size={13}/></button>
          </section>

          <section aria-labelledby="recognition-title" className="portfolio-subsection">
            <h2 id="recognition-title" className="portfolio-section-title">A few milestones</h2>
            <ul className="mt-4 divide-y divide-line">{recognition.map(r => <li key={r.id} className="py-4"><div className="experience-heading"><h3 className="text-[14px] font-medium text-fg">{r.title}</h3><span className="text-[12px] text-faint">{r.date}</span></div><p className="mt-1 text-[12px]">{r.issuer}</p></li>)}</ul>
          </section>
        </section>

        <section id="panel-projects" role="tabpanel" aria-labelledby="tab-projects" hidden={section !== 'projects'} tabIndex={0} className="portfolio-panel">
          <ProjectIndex onOpen={onProjectOpen} onExplore={exploreTechnology} />
        </section>
      </main>

      <footer className="portfolio-footer">
        <p className="font-serif text-[27px] text-fg">Let's talk.</p>
        <a href={`mailto:${profile.email}`} className="portfolio-link break-all">{profile.email}<IconArrowUpRight size={14}/></a>
        <p className="mt-5 text-[11px] text-faint">Caesar Zhou · Toronto & Waterloo</p>
      </footer>
    </div>
  )
}
