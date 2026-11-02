import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useRef } from 'react'
import { caseStudies } from '../content/caseStudies'
import type { Work } from '../content/portfolio'
import { projectVideos } from '../content/projectMedia'
import { ProjectGallery } from './ProjectGallery'
import { LoopVideo } from './LoopVideo'
import { IconArrowUpRight } from './icons'
import '../styles/projects.css'

/** One project, one column: what it is, what was built, how, and its limits. */
export default function ProjectCaseStudy({ project, onClose, onRestoreFocus }: {
  project: Work; onClose: () => void; onRestoreFocus: () => void
}) {
  const study = caseStudies[project.id]
  const video = projectVideos[project.id]
  const scroller = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
    const previousTitle = document.title
    document.title = `${project.name} · Caesar Zhou`
    return () => { document.title = previousTitle }
  }, [project.id, project.name])

  return <Dialog.Root open onOpenChange={open => { if (!open) onClose() }}>
    <Dialog.Portal><Dialog.Content className="case-study" ref={scroller} aria-describedby="case-overview"
      onCloseAutoFocus={event => { event.preventDefault(); onRestoreFocus() }}
      onOpenAutoFocus={event => { event.preventDefault(); heading.current?.focus({ preventScroll: true }) }}>
      <header className="case-header">
        <Dialog.Close className="case-back"><span aria-hidden="true">←</span> Back</Dialog.Close>
      </header>
      <article className="case-content">
        <header className="case-intro">
          <Dialog.Title asChild><h1 ref={heading} tabIndex={-1}>{project.name}</h1></Dialog.Title>
          <Dialog.Description asChild><p id="case-overview" className="case-overview">{study.overview}</p></Dialog.Description>
          {(project.event || project.award) && <p className="case-award">{[project.event, project.award].filter(Boolean).join(' · ')}</p>}
          <p className="case-meta">{study.ownership} · {project.year}</p>
          <div className="case-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer noopener" className="case-link">{link.label}<IconArrowUpRight size={13} /></a>)}</div>
        </header>

        {video
          ? <figure className="case-media"><LoopVideo src={video.src} webm={video.webm} poster={video.poster} label={`${project.name} demo video`} controls /></figure>
          : <div className="case-media"><ProjectGallery id={project.id} name={project.name} /></div>}

        <section className="case-section" aria-labelledby="case-build">
          <h2 id="case-build">Build</h2>
          <p>{study.contribution}</p>
          <p className="case-stack">{project.tags.join(' · ')}</p>
        </section>

        <section className="case-section" aria-labelledby="case-architecture">
          <h2 id="case-architecture">Architecture</h2>
          <p>{study.decision}</p>
          <ol className="case-flow">{study.architecture.map(step => <li key={step.name}><h3>{step.name}</h3><p>{step.detail}</p></li>)}</ol>
        </section>

        <section className="case-section" aria-labelledby="case-decisions">
          <h2 id="case-decisions">Decisions</h2>
          <dl className="case-decisions">{study.decisions.map(d => <div key={d.title}><dt>{d.title}</dt><dd>{d.detail}</dd></div>)}</dl>
        </section>

        <section className="case-section" aria-labelledby="case-scope">
          <h2 id="case-scope">Scope</h2>
          <p>{study.evidence}</p>
          <p>{study.scope}</p>
        </section>

        {video && <div className="case-section"><ProjectGallery id={project.id} name={project.name} /></div>}
      </article>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
