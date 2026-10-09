import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useRef, type MouseEvent } from 'react'
import { caseStudies, projectOrder } from '../content/caseStudies'
import { works, type Work } from '../content/portfolio'
import { ProjectGallery } from './ProjectGallery'
import { TechnologyTags } from './TechnologyTags'
import { HackathonRecognition } from './HackathonRecognition'
import { IconArrowRight, IconArrowUpRight, IconClose } from './icons'
import '../styles/projects.css'

export default function ProjectCaseStudy({ project, onClose, onGo, onRestoreFocus }: {
  project: Work; onClose: () => void; onGo: (id: string, replace?: boolean) => void; onRestoreFocus: () => void
}) {
  const study = caseStudies[project.id]
  const scroller = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const nextId = projectOrder[(projectOrder.indexOf(project.id) + 1) % projectOrder.length]
  const next = works.find(p => p.id === nextId)!
  useEffect(() => {
    scroller.current?.scrollTo({top:0, behavior:'instant'})
    heading.current?.focus({preventScroll:true})
    const previousTitle = document.title
    document.title = `${project.name} · Engineering case study · Caesar Zhou`
    return () => { document.title = previousTitle }
  }, [project.id, project.name])
  const goNext = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); onGo(next.id, true)
  }
  const jumpToSection = (event: MouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest('a')
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const section = document.getElementById(link.hash.slice(1))
    section?.focus({preventScroll:true})
    section?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'})
  }
  return <Dialog.Root open onOpenChange={open => {if (!open) onClose()}}>
    <Dialog.Portal><Dialog.Content className="case-study" ref={scroller} aria-describedby="case-overview"
      onCloseAutoFocus={event => {event.preventDefault(); onRestoreFocus()}}
      onOpenAutoFocus={event => {event.preventDefault(); heading.current?.focus({preventScroll:true})}}>
      <header className="case-header"><div className="case-header-inner">
        <Dialog.Close className="case-back"><span aria-hidden="true">←</span> All projects</Dialog.Close>
        <span className="case-header-name">Caesar Zhou / {project.name}</span>
        <Dialog.Close className="case-close" aria-label="Close case study"><IconClose size={18}/></Dialog.Close>
      </div></header>
      <article className="case-content">
        <section className="case-intro">
          <p className="work-eyebrow">{study.focus} · {project.year}</p>
          {project.event && <HackathonRecognition event={project.event} year={project.year} award={project.award}/>}
          <Dialog.Title asChild><h1 ref={heading} tabIndex={-1}>{project.name}</h1></Dialog.Title>
          <Dialog.Description asChild><p id="case-overview" className="case-overview">{study.overview}</p></Dialog.Description>
          <p className="case-ownership">{study.ownership}</p>
          <div className="case-source-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer noopener" className="case-link">{link.label}<IconArrowUpRight size={14}/></a>)}</div>
        </section>
        <div className="case-layout">
          <aside className="case-aside"><nav aria-label="Case study sections" onClick={jumpToSection}><a href="#case-contribution">The build</a><a href="#case-architecture">Architecture</a><a href="#case-decisions">Decisions</a><a href="#case-evidence">Evidence & scope</a></nav>
            <h2>Built with</h2><TechnologyTags items={project.tags} label={`Technologies used in ${project.name}`}/>
          </aside>
          <div className="case-body">
            <section id="case-contribution" tabIndex={-1} className="case-section"><p className="work-eyebrow">01 / The build</p><h2>{study.ownership.toLowerCase().includes('team') ? 'What we built' : 'What I built'}</h2><p>{study.contribution}</p>
              <div className="case-image"><ProjectGallery id={project.id} name={project.name} wide/><p>Original project media. Open the gallery for captions and sources.</p></div>
            </section>
            <section id="case-architecture" tabIndex={-1} className="case-section"><p className="work-eyebrow">02 / Architecture</p><h2>How the pieces connect</h2><p className="case-section-lead">{study.decision}</p>
              <ol className="architecture-flow" aria-label={`${project.name} data flow`}>{study.architecture.map((step, index) => <li key={step.name}><span className="architecture-number">0{index+1}</span><h3>{step.name}</h3><p>{step.detail}</p>{index < study.architecture.length - 1 && <span className="architecture-arrow" aria-hidden="true">→</span>}</li>)}</ol>
            </section>
            <section id="case-decisions" tabIndex={-1} className="case-section"><p className="work-eyebrow">03 / Decisions</p><h2>Engineering decisions</h2><div className="case-decisions">{study.decisions.map((decision,index) => <div key={decision.title}><span aria-hidden="true">0{index+1}</span><div><h3>{decision.title}</h3><p>{decision.detail}</p></div></div>)}</div></section>
            <section id="case-evidence" tabIndex={-1} className="case-section"><p className="work-eyebrow">04 / Evidence & scope</p><h2>What this build demonstrates</h2><p>{study.evidence}</p>{project.award && <p className="work-award">{project.award}</p>}<ul className="case-capabilities" aria-label="Demonstrated skills">{study.capabilities.map(skill => <li key={skill}>{skill}</li>)}</ul><div className="case-scope"><h3>Project scope</h3><p>{study.scope}</p></div><div className="case-source-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer noopener" className="portfolio-link">{link.label}<IconArrowUpRight size={13}/></a>)}</div></section>
          </div>
        </div>
        <footer className="case-next"><div><p className="work-eyebrow">Next project</p><a href={`?tab=projects&project=${next.id}`} onClick={goNext}>{next.name}<IconArrowRight size={24}/></a></div><Dialog.Close className="portfolio-link">Back to all projects</Dialog.Close></footer>
      </article>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
