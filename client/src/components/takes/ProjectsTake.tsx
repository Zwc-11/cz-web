import { works } from '../../content/portfolio'
import { IconArrowUpRight } from '../icons'
import { ProjectGallery } from '../ProjectGallery'
import { Tag } from '../ui'
import { TakeHead } from './parts'

export function ProjectsTake() {
  const order = ['hindsight', 'murmur', 'marketimmune', 'agentreplay', 'chaoswing', 'quant-portfolio']
  const projects = works.filter(p => p.category !== 'Robotics').sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id))
  return (
    <>
      <TakeHead kicker="Six builds · Built on my own time" title="Tools for markets and agents">
        Research infrastructure I wanted and couldn't find: backtests that can't cheat, and harnesses that tell you when an agent is guessing. Open a build to see the decisions behind it.
      </TakeHead>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        {projects.map(p => {
          return <article key={p.id} id={p.id} className="overflow-hidden rounded-[16px] border border-line transition-colors hover:border-line-2">
            <div className="aspect-[16/9] overflow-hidden border-b border-line bg-surface p-3">
              <ProjectGallery id={p.id} name={p.name} wide />
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between gap-3"><h3 className="text-[18px] font-semibold tracking-[-0.015em] text-fg">{p.name}</h3><span className="font-mono text-[11px] text-faint">{p.year}</span></div>
              <p className="mt-1 text-[14.5px] text-fg/85">{p.tagline}</p>
              {p.award && <p className="growth-ink mt-2 text-[12px]">{p.award}</p>}
              <p className="mt-3 text-[14px] leading-[1.65]">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{p.tags.slice(0,3).map(t=><Tag key={t}>{t}</Tag>)}</div>
              <details className="project-story mt-4 border-y border-line pb-1">
                <summary>Inside {p.name}</summary>
                <div className="pb-5"><h4>The problem</h4><p>{p.problem}</p><h4>What I built</h4><p>{p.approach}</p><h4>What came out of it</h4><p>{p.result}</p>
                </div>
              </details>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">{p.links.map(l=><a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-9 items-center gap-1.5 text-[13px] text-fg hover:text-rec-ink">{l.label}<IconArrowUpRight size={13}/></a>)}</div>
            </div>
          </article>
        })}
      </div>
    </>
  )
}
