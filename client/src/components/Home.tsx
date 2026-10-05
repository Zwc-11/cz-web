import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { experience, recognition, works, type Work } from '../content/portfolio'
import { profile } from '../content/profile'
import type { TakeId } from '../content/takes'
import type { Theme } from '../hooks/useTheme'
import { IconArrowRight, IconArrowUpRight, IconCopy, IconFile, IconGitHub, IconLinkedIn } from './icons'
import { OrgMark } from './ui'
import { ProjectGallery } from './ProjectGallery'
import { ThemeToggle } from './ThemeToggle'
import { ElementSignature } from './ElementSignature'
import { AnimatedIntro } from './AnimatedIntro'
import { EngineeringLauncher } from './EngineeringLauncher'
import { HackathonRecognition } from './HackathonRecognition'
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

const projectSummary: Record<string, string> = {
  takeone: 'An AI filmmaking system that takes a scene from direction to rehearsal and filming.',
  hindsight: 'A backtesting platform that checks whether a strategy is using information from the future.',
  murmur: 'An evaluation harness for financial-document agents, with inspectable evidence and decision traces.',
  marketimmune: 'A benchmark for detecting harmful and manipulative behaviour from trading agents.',
  agentreplay: 'Record, replay and inspect AI agent runs to understand where they went wrong.',
  chaoswing: 'A neural search system that finds and ranks related prediction markets.',
  'quant-portfolio': 'A stock-portfolio construction engine using Monte Carlo simulation, CAPM and Modern Portfolio Theory.',
  autodump: 'An autonomous rover that finds full bins, docks and empties them using computer vision.',
  jamhacks8: 'A configurable plant-watering system with sensors and microcontrollers.',
  'baymax-bot': 'A companion robot combining voice interaction, emotion recognition and a health-information app.',
  xrsze: 'A computer-vision rep counter with an AI workout and meal-planning coach.',
}

function TechnologyTags({ items, label, onExplore }: { items: readonly string[]; label: string; onExplore: (technology: string) => void }) {
  return <ul className="technology-tags" aria-label={label}>
    {items.map(item => <li key={item}><button type="button" className="technology-tag" onClick={() => onExplore(item)} aria-label={`Find work using ${item}`}>{item}<span aria-hidden="true">↗</span></button></li>)}
  </ul>
}

function ProjectRow({ project: p, onOpen, onExplore }: { project: Work; onOpen: (id: TakeId) => void; onExplore: (technology: string) => void }) {
  const reduce = useReducedMotion()
  return (
    <motion.article className="portfolio-project" id={`project-${p.id}`} tabIndex={-1}
      initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -24px 0px' }} transition={{ duration: reduce ? 0 : .45 }}>
      <div className="project-heading">
        <div className="min-w-0">
          {p.event && <HackathonRecognition event={p.event} year={p.year} award={p.award} />}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[20px] font-semibold tracking-[-0.025em] text-fg">{p.name}</h3>
            {!p.event && <span className="text-[12px] text-faint">{p.year}</span>}
          </div>
          <p className="mt-2 max-w-[560px] text-[14px] leading-[1.7]">{projectSummary[p.id] ?? p.summary}</p>
          {!p.event && p.award && <p className="growth-ink mt-2 text-[12px]">{p.award}</p>}
        </div>
        <ProjectGallery id={p.id} name={p.name} />
      </div>
      <TechnologyTags items={p.tags} label={`Technologies used in ${p.name}`} onExplore={onExplore} />
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
        {p.links.map(l => <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener" className="portfolio-link">
          {l.label}<IconArrowUpRight size={13} />
        </a>)}
        {p.id === 'takeone' && <button type="button" className="portfolio-link" onClick={() => onOpen('takeone')}>Explore TakeOne<IconArrowRight size={13}/></button>}
      </div>
      <details className="project-story mt-2">
        <summary aria-label={`Read more about ${p.name}`}>Read more</summary>
        <div className="max-w-[620px] pb-4">
          <h4>The problem</h4><p>{p.problem}</p>
          <h4>What I built</h4><p>{p.approach}</p>
          <h4>What came out of it</h4><p>{p.result}</p>
        </div>
      </details>
    </motion.article>
  )
}

export function Home({ theme, onTheme, onOpen, onCopy }: {
  theme: Theme
  onTheme: (o?: { x: number; y: number }) => void
  onOpen: (id: TakeId, origin?: Origin) => void
  onCopy: () => void
}) {
  const [section, setSection] = useState<Section>(currentSection)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const [searchRequest, setSearchRequest] = useState<{ query: string; revision: number }>()
  const reduce = useReducedMotion()
  const tabRefs = useRef<Partial<Record<Section, HTMLButtonElement | null>>>({})
  const projectOrder = ['takeone', 'hindsight', 'murmur', 'marketimmune', 'agentreplay', 'chaoswing', 'quant-portfolio']
  const featured = works.filter(p => projectOrder.includes(p.id)).sort((a, b) => projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id))
  const hackathons = works.filter(p => p.category === 'Robotics' && p.id !== 'takeone')
  const filters = ['All', 'AI & agents', 'Markets & data', 'Hackathons']
  const matches = (p: Work) => (filter === 'All' || (filter === 'Hackathons' ? p.category === 'Robotics' : p.category === filter))
    && `${p.name} ${projectSummary[p.id] ?? p.summary} ${p.tags.join(' ')} ${p.event ?? ''} ${p.award ?? ''}`.toLowerCase().includes(query.trim().toLowerCase())
  const visibleFeatured = featured.filter(matches)
  const visibleHackathons = hackathons.filter(matches)
  const visibleProjects = [...visibleFeatured, ...visibleHackathons]
  const chooseProject = () => {
    const options = visibleProjects.filter(p => p.id !== picked)
    const pool = options.length ? options : visibleProjects
    if (!pool.length) return
    const project = pool[Math.floor(Math.random() * pool.length)]
    setPicked(project.id)
    const row = document.getElementById(`project-${project.id}`)
    const detail = row?.querySelector('details')
    if (detail) detail.open = true
    row?.querySelector('summary')?.focus({ preventScroll: true })
    row?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' })
  }

  useEffect(() => {
    const sync = () => setSection(currentSection())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
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
    setQuery('')
    setFilter('All')
    setPicked(null)
    selectSection(selection.kind === 'project' ? 'projects' : 'experience')
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

        <FocusExplorer onSelect={jumpToWork} />
        <EngineeringLauncher />

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
                <TechnologyTags items={d.stack} label={`Tools and skills used at ${d.org}`} onExplore={exploreTechnology} />
                <details className="project-story mt-1">
                  <summary aria-label={`Read about my work at ${d.org}`}>What I worked on</summary>
                  <div className="pb-3"><p>{d.shipped}</p><h4>Results</h4><p>{d.result}</p>
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
          <h2 className="sr-only">Projects</h2>
          <div className="project-explorer">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><p className="text-[12px] text-faint">Independent projects & hackathon builds</p><button type="button" className="portfolio-link pick-project" disabled={!visibleProjects.length} onClick={chooseProject}><span aria-hidden="true">↗</span> Pick a project for me</button></div>
            <label className="sr-only" htmlFor="project-search">Search projects by name, topic or technology</label>
            <div className="project-search"><input id="project-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setPicked(null) }} placeholder="Find a project, topic or technology…" />{query && <button type="button" onClick={() => { setQuery(''); document.getElementById('project-search')?.focus() }} aria-label="Clear project search">×</button>}</div>
            <div className="project-filters" role="group" aria-label="Filter projects">{filters.map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => {setFilter(item); setPicked(null)}}>{item}</button>)}</div>
            <p className="mt-3 text-[11px] text-faint" role="status">{visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}{picked ? ` · Exploring ${works.find(p => p.id === picked)?.name}` : ''}</p>
          </div>
          {!visibleProjects.length && <div className="project-empty"><p>No projects match that search.</p><button type="button" className="portfolio-link" onClick={() => {setQuery('');setFilter('All')}}>Show all projects<IconArrowRight size={13}/></button></div>}
          <div className="divide-y divide-line">{visibleFeatured.map(p => <ProjectRow key={p.id} project={p} onOpen={onOpen} onExplore={exploreTechnology} />)}</div>
          {visibleHackathons.length > 0 && <section aria-labelledby="hackathons-title" className="portfolio-subsection">
            <h2 id="hackathons-title" className="portfolio-section-title">More from hackathons</h2>
            <p className="mt-2 text-[14px]">A few more weekends spent making something with a team.</p>
            <div className="mt-2 divide-y divide-line">{visibleHackathons.map(p => <ProjectRow key={p.id} project={p} onOpen={onOpen} onExplore={exploreTechnology} />)}</div>
          </section>}
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
