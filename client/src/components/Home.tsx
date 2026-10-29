import type { MouseEvent, ReactNode } from 'react'
import { profile } from '../content/profile'
import type { TakeId } from '../content/takes'
import type { Theme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'
import '../styles/interactions.css'
import '../styles/simple.css'

export type Origin = { top: number; left: number; width: number; height: number }

// Plain-text homepage: one intro line, then short lists. Every fact here
// also appears in deployments.ts, onepage.ts or the résumé.

type Org = { name: string; logo?: string; href?: string }
type Row = { lead: string; org?: Org; project?: { name: string; id: string; line: string }; sub?: string }

const recently: Row[] = [
  {
    lead: 'ai adoption & deployment engineering intern at',
    org: { name: 'ecobee', logo: 'logos/ecobee.png', href: 'https://www.ecobee.com' },
    sub: 'embedded with finance, accounting and sales. 30+ ai tools shipped, saving people 2+ hours a day',
  },
  {
    lead: 'full-stack ai engineer at',
    org: { name: 'wealthy doctor institute' },
    sub: 'built their marketing agents; the business picked up 70+ clients',
  },
  {
    lead: 'data scientist & ai platform engineer at',
    org: { name: 'gore mutual', logo: 'logos/gore.png', href: 'https://www.goremutual.ca' },
    sub: 'rag for underwriters, 89.5% strict accuracy on 200+ labeled questions',
  },
  {
    lead: 'robotics & software developer at',
    org: { name: 'canadian stem and ai academy' },
  },
]

const hackathons: Row[] = [
  {
    lead: '',
    org: { name: 'hack the north 2026', logo: 'logos/htn.png' },
    project: { name: 'TakeOne', id: 'takeone', line: 'a robot film crew with an ai director' },
    sub: 'highest score of the 12 finalists',
  },
  {
    lead: '',
    org: { name: 'la hacks 2026', logo: 'logos/lahacks.png' },
    project: { name: 'SproutPass', id: 'sproutpass', line: 'ai companions that pass outgrown baby clothes along' },
    sub: 'visa challenge winner, photon imessage runner-up',
  },
  {
    lead: '',
    org: { name: 'makecu 2025' },
    project: { name: 'AutoDump', id: 'autodump', line: 'a trash rover that empties itself' },
    sub: '3rd place overall',
  },
  {
    lead: '',
    org: { name: 'jamhacks 8', logo: 'logos/jamhacks.png' },
    project: { name: 'Modular Watering', id: 'jamhacks8', line: 'a configurable plant-watering rig' },
    sub: 'best hardware',
  },
]

const projects = [
  { id: 'daycube', name: 'DayCube', line: 'replay your day as a voxel world you can ask questions about' },
  { id: 'hindsight', name: 'Hindsight', line: 'a backtesting engine that checks itself for look-ahead leakage' },
  { id: 'murmur', name: 'Murmur', line: 'a reliability harness for agents, replayable in ci' },
  { id: 'marketimmune', name: 'MarketImmune', line: 'a market-safety benchmark for trading agents' },
  { id: 'agentreplay', name: 'AgentReplay', line: 'record, replay and diff browser agents' },
  { id: 'chaoswing', name: 'ChaosWing', line: 'search for related prediction markets' },
]

function Mark({ org }: { org: Org }) {
  return org.logo ? <img className="s-logo" src={org.logo} alt="" width={18} height={18} /> : null
}

function OrgName({ org }: { org: Org }) {
  const label = <><Mark org={org} />{org.href ? <a className="s-link" href={org.href} target="_blank" rel="noreferrer noopener">{org.name}</a> : <span>{org.name}</span>}</>
  return <span className="s-org">{label}</span>
}

function List({ label, children }: { label: string; children: ReactNode }) {
  return <section className="s-section" aria-label={label}>
    <h2 className="s-label">{label}</h2>
    <ul className="s-list">{children}</ul>
  </section>
}

export function Home({ theme, onTheme, onCopy, onProjectOpen }: {
  theme: Theme
  onTheme: (o?: { x: number; y: number }) => void
  onOpen: (id: TakeId, origin?: Origin) => void
  onCopy: () => void
  onProjectOpen: (id: string) => void
}) {
  const openCase = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onProjectOpen(id)
  }
  const caseLink = (id: string, name: string) => <a className="s-link" href={`?project=${id}`} onClick={e => openCase(e, id)}>{name}</a>

  return <div className="s-page">
    <ThemeToggle theme={theme} onToggle={onTheme} className="s-theme" />
    <main id="main">
      <h1 className="s-intro">
        i'm caesar, studying computer science & finance at{' '}
        <OrgName org={{ name: 'university of waterloo', logo: 'logos/waterloo.png', href: 'https://uwaterloo.ca' }} />.
      </h1>

      <List label="recently">
        {recently.map(r => <li key={r.org!.name}>
          <p>{r.lead} <OrgName org={r.org!} /></p>
          {r.sub && <p className="s-sub"><span aria-hidden="true">↳ </span>{r.sub}</p>}
        </li>)}
      </List>

      <List label="hackathons">
        {hackathons.map(h => <li key={h.org!.name}>
          <p>{caseLink(h.project!.id, h.project!.name)} at <OrgName org={h.org!} /></p>
          <p className="s-sub"><span aria-hidden="true">↳ </span>{h.project!.line}. <span className="s-win">{h.sub}</span></p>
        </li>)}
      </List>

      <List label="also built">
        {projects.map(p => <li key={p.id}><p>{caseLink(p.id, p.name)}<span className="s-dim">: {p.line}</span></p></li>)}
      </List>

      <p className="s-outro">i also build robots after hours <span className="s-dim">(and used to coach FRC and VEX teams)</span></p>

      <p className="s-contact">
        <button type="button" className="s-link" onClick={onCopy} aria-label={`Copy email address: ${profile.email}`}>email</button>
        <span aria-hidden="true"> · </span>
        <a className="s-link" href={profile.socials[0].href} target="_blank" rel="noreferrer noopener">github</a>
        <span aria-hidden="true"> · </span>
        <a className="s-link" href={profile.socials[1].href} target="_blank" rel="noreferrer noopener">linkedin</a>
        <span aria-hidden="true"> · </span>
        <a className="s-link" href={profile.socials[2].href} target="_blank" rel="noreferrer noopener">devpost</a>
        <span aria-hidden="true"> · </span>
        <a className="s-link" href={`mailto:${profile.email}?subject=Resume%20request`}>résumé</a>
      </p>
    </main>
  </div>
}
