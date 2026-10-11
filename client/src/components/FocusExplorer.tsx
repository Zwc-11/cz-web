import { useId, useState } from 'react'
import { experience, works } from '../content/portfolio'
import type { ExploreSelection } from './QuickExplore'
import './FocusExplorer.css'

type FocusKey = 'ai' | 'finance' | 'product' | 'hackathons'
type Evidence = ExploreSelection & { summary: string }
type FocusArea = { id: FocusKey; label: string; entries: Evidence[] }

// Short reading routes through existing work. Each line summarizes the corresponding
// portfolio entry; names, employment types and awards come from the source data.
const areas: FocusArea[] = [
  {
    id: 'ai', label: 'AI agents', entries: [
      { kind: 'experience', id: 'ecobee', summary: '30+ AI tools and 15+ agents for finance, accounting and sales teams.' },
      { kind: 'project', id: 'murmur', summary: 'Task contracts, repeated attempts and trace evidence for coding agents.' },
      { kind: 'project', id: 'agentreplay', summary: 'Record browser workflows and pinpoint where an agent run diverges.' },
    ],
  },
  {
    id: 'finance', label: 'Evaluation & data', entries: [
      { kind: 'experience', id: 'gore', summary: 'RAG retrieval evaluated on 200+ labeled questions, plus actuarial GLMs.' },
      { kind: 'project', id: 'hindsight', summary: 'Point-in-time data, deterministic replay and leakage checks for backtesting.' },
      { kind: 'project', id: 'chaoswing', summary: 'Two-stage neural retrieval and reranking, evaluated on time-safe splits.' },
    ],
  },
  {
    id: 'product', label: 'Full-stack', entries: [
      { kind: 'experience', id: 'wdi', summary: 'Built an AI marketing platform that helped the business acquire 70+ clients.' },
      { kind: 'project', id: 'marketimmune', summary: 'A React / Django research dashboard over a six-agent investigation loop.' },
      { kind: 'project', id: 'agentreplay', summary: 'A recorder, replay backend and React Flow dashboard for browser-agent testing.' },
    ],
  },
  {
    id: 'hackathons', label: 'Applied AI', entries: [
      { kind: 'project', id: 'takeone', summary: 'Voice agent → structured shot plan → validated 3D rehearsal → supervised filming.' },
      { kind: 'project', id: 'xrsze', summary: 'MediaPipe pose tracking plus an LLM coach for workouts and meal plans.' },
      { kind: 'project', id: 'autodump', summary: 'Vision-guided autonomy with ArUco markers, range sensing and motor control.' },
    ],
  },
]

type FocusRow = Evidence & { label: string; type: string; event?: string; award?: string }

function resolveRow(entry: Evidence): FocusRow[] {
  if (entry.kind === 'experience') {
    const job = experience.find(item => item.id === entry.id)
    return job ? [{ ...entry, label: job.org, type: job.employmentType }] : []
  }
  const project = works.find(item => item.id === entry.id)
  return project ? [{ ...entry, label: project.name, type: 'Project', event: project.event, award: project.award }] : []
}

export function FocusExplorer({ onSelect }: { onSelect: (selection: ExploreSelection) => void }) {
  const [focus, setFocus] = useState<FocusKey>('ai')
  const headingId = useId()
  const area = areas.find(item => item.id === focus) ?? areas[0]
  const rows = area.entries.flatMap(resolveRow)
  const experienceCount = rows.filter(row => row.kind === 'experience').length
  const projectCount = rows.length - experienceCount

  return <section className="focus-explorer" aria-labelledby={headingId}>
    <div className="focus-explorer-heading">
      <h2 id={headingId}>Explore by focus</h2>
      <span>Start with relevant work</span>
    </div>
    <div className="focus-explorer-choices" role="group" aria-label="Choose a focus">
      {areas.map(item => <button type="button" key={item.id} aria-pressed={focus === item.id} onClick={() => setFocus(item.id)}>
        {item.label}
      </button>)}
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{area.label}: {experienceCount ? `${experienceCount} experience and ` : ''}{projectCount} projects. Choose an item to read its details.</p>
    <ul className="focus-explorer-list" aria-label={`${area.label} work`}>
      {rows.map(row => <li key={`${row.kind}-${row.id}`}>
        <button type="button" className="focus-explorer-row" onClick={() => onSelect({ kind: row.kind, id: row.id })}>
          <span className="focus-explorer-row-content">
            <span className="focus-explorer-row-heading">
              <span className="focus-explorer-row-label">{row.label}</span>
              {row.event ? <span className="focus-explorer-row-event">{row.event}</span> : <span className="focus-explorer-row-type">{row.type}</span>}
              {row.award && <span className="focus-explorer-row-award">{row.award}</span>}
            </span>
            <span className="focus-explorer-row-summary">{row.summary}</span>
          </span>
          <svg className="focus-explorer-arrow" width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </li>)}
    </ul>
  </section>
}
