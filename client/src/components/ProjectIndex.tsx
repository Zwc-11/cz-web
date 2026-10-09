import { useEffect, useState, type MouseEvent } from 'react'
import { works, type Work } from '../content/portfolio'
import { caseStudies, projectOrder, selectedProjectIds } from '../content/caseStudies'
import { HackathonRecognition } from './HackathonRecognition'
import { ProjectGallery } from './ProjectGallery'
import { TechnologyTags } from './TechnologyTags'
import { IconArrowRight, IconArrowUpRight } from './icons'
import { matchesTerms } from '../lib/projectNavigation'
import '../styles/projects.css'

const filters = ['All', 'AI & agents', 'Markets & data', 'Hackathons'] as const
type Filter = typeof filters[number]
const initialState = () => {
  const params = new URLSearchParams(window.location.search)
  return {query: params.get('q') ?? '', filter: filters.includes(params.get('focus') as Filter) ? params.get('focus') as Filter : 'All' as Filter}
}

function ProjectCard({ project: p, variant, onOpen, onExplore }: {
  project: Work; variant: 'selected' | 'compact' | 'hackathon'; onOpen: (id: string) => void; onExplore: (technology: string) => void
}) {
  const study = caseStudies[p.id]
  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onOpen(p.id)
  }
  return <article className={`work-card work-card-${variant}`} id={`project-${p.id}`} tabIndex={-1}>
    <div className="work-visual">
      <ProjectGallery id={p.id} name={p.name} wide />
      {variant === 'selected' && <ul className="work-capabilities" aria-label={`Engineering skills demonstrated by ${p.name}`}>
        {study.capabilities.map(skill => <li key={skill}>{skill}</li>)}
      </ul>}
    </div>
    <div className="work-copy">
      <div className="work-meta"><span>{study.focus}</span><span>{p.year}</span></div>
      {p.event && <HackathonRecognition event={p.event} year={p.year} award={p.award} />}
      <h3 className="work-title"><a href={`?tab=projects&project=${p.id}`} onClick={open}>{p.name}<IconArrowUpRight size={18} /></a></h3>
      <p className="work-overview">{study.overview}</p>
      <p className="work-ownership">{study.ownership}</p>
      <p className="work-contribution">{study.contribution}</p>
      {variant === 'selected' && <div className="work-decision"><span>Key decision</span><p>{study.decision}</p></div>}
      <p className="work-evidence"><span>Evidence</span>{study.evidence}</p>
      {!p.event && p.award && <p className="work-award">{p.award}</p>}
      <TechnologyTags items={p.tags} label={`Technologies used in ${p.name}`} onExplore={onExplore} />
      <div className="work-actions">
        <a className="case-link" href={`?tab=projects&project=${p.id}`} onClick={open} aria-label={`Read ${p.name} case study`}>Inside the build<IconArrowRight size={15} /></a>
        {p.links.filter(link => link.label === 'Source code' || link.label === 'Watch the demo').slice(0, 1).map(link => <a key={link.href} className="portfolio-link" href={link.href} target="_blank" rel="noreferrer noopener">{link.label}<IconArrowUpRight size={13} /></a>)}
      </div>
    </div>
  </article>
}

export function ProjectIndex({ onOpen, onExplore }: {onOpen: (id: string) => void; onExplore: (technology: string) => void}) {
  const [state, setState] = useState(initialState)
  useEffect(() => {
    const sync = () => setState(initialState())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const update = (next: typeof state) => {
    setState(next)
    const url = new URL(window.location.href)
    if (next.query) url.searchParams.set('q', next.query); else url.searchParams.delete('q')
    if (next.filter !== 'All') url.searchParams.set('focus', next.filter); else url.searchParams.delete('focus')
    window.history.replaceState(null, '', url)
  }
  const visible = projectOrder.flatMap(id => {
    const work = works.find(item => item.id === id)
    if (!work) return []
    const study = caseStudies[id]
    const matchesFilter = state.filter === 'All' || (state.filter === 'Hackathons' ? !!work.event : work.category === state.filter)
    const haystack = `${work.name} ${work.tags.join(' ')} ${work.event ?? ''} ${work.award ?? ''} ${study.focus} ${study.contribution} ${study.decision} ${study.capabilities.join(' ')}`.toLowerCase()
    return matchesFilter && matchesTerms(haystack, state.query) ? [work] : []
  })
  const selected = visible.filter(p => selectedProjectIds.includes(p.id))
  const engineering = visible.filter(p => !selectedProjectIds.includes(p.id) && !p.event)
  const hackathons = visible.filter(p => !selectedProjectIds.includes(p.id) && !!p.event)

  return <div className="project-index">
    <header className="work-section-heading">
      <div><p className="work-eyebrow">Personal projects & hackathons</p><h2>Selected projects</h2></div>
      <p>What I built, how it works, and the decisions behind it.</p>
    </header>
    <div className="work-toolbar">
      <div className="project-filters" role="group" aria-label="Filter projects">{filters.map(filter => <button key={filter} type="button" aria-pressed={state.filter === filter} onClick={() => update({...state, filter})}>{filter}</button>)}</div>
      <div className="project-search">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <label htmlFor="project-search" className="sr-only">Search projects by name, skill or technology</label>
        <input id="project-search" type="search" value={state.query} onChange={event => update({...state, query: event.target.value})} placeholder="Search work or skills…" />
        {state.query && <button type="button" onClick={() => {update({...state, query: ''}); document.getElementById('project-search')?.focus()}} aria-label="Clear project search">×</button>}
      </div>
    </div>
    <p className="work-count" role="status">{visible.length} {visible.length === 1 ? 'project' : 'projects'}{state.filter !== 'All' ? ` · ${state.filter}` : ''}</p>
    {!visible.length && <div className="project-empty"><h3>No matching projects.</h3><p>Try a technology, engineering skill or hackathon name.</p><button type="button" className="case-link" onClick={() => update({query:'', filter:'All'})}>Clear filters<IconArrowRight size={15}/></button></div>}
    {selected.map(p => <ProjectCard key={p.id} project={p} variant="selected" onOpen={onOpen} onExplore={onExplore} />)}
    {!!engineering.length && <section aria-labelledby="engineering-title" className="work-collection"><div className="work-collection-heading"><h2 id="engineering-title">More engineering work</h2><p>Agents, search and financial systems.</p></div>
      {engineering.map(p => <ProjectCard key={p.id} project={p} variant="compact" onOpen={onOpen} onExplore={onExplore} />)}
    </section>}
    {!!hackathons.length && <section aria-labelledby="hackathons-title" className="work-collection"><div className="work-collection-heading"><h2 id="hackathons-title">Hackathon builds</h2><p>Hackathon projects & awards</p></div><div className="hackathon-grid">
      {hackathons.map(p => <ProjectCard key={p.id} project={p} variant="hackathon" onOpen={onOpen} onExplore={onExplore} />)}
    </div></section>}
  </div>
}
