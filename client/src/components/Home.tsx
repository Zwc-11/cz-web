import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { experience, recognition, works } from '../content/portfolio'
import { profile } from '../content/profile'
import type { TakeId } from '../content/takes'
import type { Theme } from '../hooks/useTheme'
import {
  IconArrowRight, IconArrowUpRight, IconBriefcase, IconCopy, IconDevpost, IconFile, IconGitHub, IconHome, IconLayers, IconLinkedIn, IconMail, IconSearch,
} from './icons'
import { OrgMark } from './ui'
import { ProjectIndex } from './ProjectIndex'
import { TechnologyTags } from './TechnologyTags'
import { ElementSignature } from './ElementSignature'
import { AnimatedIntro } from './AnimatedIntro'
import { FocusExplorer } from './FocusExplorer'
import { QuickExplore, type ExploreSelection } from './QuickExplore'
import { Dock, ThemeGlyph, type DockItem } from './Dock'
import {
  AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, type Transition,
} from 'motion/react'
import '../styles/interactions.css'

export type Origin = { top: number; left: number; width: number; height: number }

const ease = [0.22, 0.8, 0.2, 1] as const
const glide: Transition = { type: 'spring', stiffness: 380, damping: 34, mass: 0.7 }

/** Rect of the clicked control, so a take can zoom out of it. */
const originOf = (e: MouseEvent<HTMLElement>): Origin => {
  const r = e.currentTarget.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

/** One gliding highlight per list: it slides between rows instead of blinking. */
function useGlide() {
  const [hovered, setHovered] = useState<string | null>(null)
  const bind = useCallback((id: string) => ({
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setHovered(id) },
    onPointerLeave: () => setHovered(h => (h === id ? null : h)),
  }), [])
  return { hovered, bind }
}

function Highlight({ show, group }: { show: boolean; group: string }) {
  return <AnimatePresence>
    {show && <motion.span aria-hidden="true" layoutId={`glide-${group}`} className="row-highlight"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.18 } }} transition={glide} />}
  </AnimatePresence>
}

/** Thin progress line at the very top of the page. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />
}

const introStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const rise = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}
type Section = 'experience' | 'projects'
const sections: Section[] = ['experience', 'projects']
const currentSection = (): Section => new URLSearchParams(window.location.search).get('tab') === 'projects' ? 'projects' : 'experience'

const experienceSummary: Record<string, string> = {
  ecobee: 'Embedded with finance, accounting and sales teams, turning manual close, reconciliation and reporting work into governed AI agents and tools.',
  wdi: 'Owned an agentic marketing platform end to end: research, SEO/GEO, lead qualification and content, plus its data and review layer.',
  gore: 'Built and evaluated a RAG system and an analytics agent for underwriting and actuarial teams, measured on 200+ labeled questions.',
  csaa: 'Wrote and taught C++ control software, and built a firmware/SDK generator that removed repeated embedded setup for student teams.',
  brandeq: 'Ran client discovery and delivery for community-organisation websites, leading a student development team.',
}

// Every figure here is already on the site and traces to the résumé (see deployments.ts).
const impact = [
  { value: '30+', label: 'AI tools shipped at ecobee' },
  { value: '2+ h', label: 'saved per user, per day' },
  { value: '89.5%', label: 'strict RAG accuracy, 200+ questions' },
  { value: '70+', label: 'clients won on a platform I built' },
]

// How I work as a forward deployed engineer.
const loop = [
  { step: 'Embed', detail: 'Sit with the team doing the work' },
  { step: 'Map', detail: 'Trace the workflow and its data' },
  { step: 'Ship', detail: 'Agents, tools and integrations' },
  { step: 'Harden', detail: 'Evals, telemetry and approvals' },
]

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
  const tabsRef = useRef<HTMLDivElement>(null)
  const [atTop, setAtTop] = useState(true)
  const expGlide = useGlide()
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', v => {
    const tabsTop = tabsRef.current ? tabsRef.current.getBoundingClientRect().top + v : 400
    setAtTop(v < tabsTop - 220)
  })
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

  const behavior: ScrollBehavior = reduce ? 'instant' : 'smooth'
  const goSection = (next: Section) => {
    selectSection(next)
    requestAnimationFrame(() => tabsRef.current?.scrollIntoView({ behavior, block: 'start' }))
  }
  const openExplore = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))

  const dock: DockItem[][] = [
    [
      { id: 'home', label: 'Home', icon: <IconHome size={19} />, active: atTop, onClick: () => window.scrollTo({ top: 0, behavior }) },
      { id: 'experience', label: 'Experience', icon: <IconBriefcase size={19} />, active: !atTop && section === 'experience', onClick: () => goSection('experience') },
      { id: 'projects', label: 'Projects', icon: <IconLayers size={19} />, active: !atTop && section === 'projects', onClick: () => goSection('projects') },
      { id: 'explore', label: 'Search  Ctrl K', icon: <IconSearch size={19} />, onClick: openExplore },
    ],
    [
      { id: 'email', label: 'Copy email', icon: <IconMail size={19} />, onClick: onCopy },
      { id: 'github', label: 'GitHub', icon: <IconGitHub size={19} />, href: profile.socials[0].href },
      { id: 'linkedin', label: 'LinkedIn', icon: <IconLinkedIn size={19} />, href: profile.socials[1].href },
      { id: 'devpost', label: 'Devpost', icon: <IconDevpost size={19} />, href: profile.socials[2].href },
    ],
    [
      {
        id: 'theme', label: theme === 'dark' ? 'Light mode  T' : 'Dark mode  T', icon: <ThemeGlyph theme={theme} />,
        onClick: e => { const r = e.currentTarget.getBoundingClientRect(); onTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 }) },
      },
    ],
  ]

  return (
    <>
    <ScrollProgress />
    <div className="portfolio-shell">
      <a href="#main" className="portfolio-skip">Skip to content</a>
      <header className="portfolio-header">
        <span className="portfolio-name name-mark font-mono text-[11px] tracking-[0.1em] text-faint uppercase"><span className="status-dot" aria-hidden="true" />Caesar Zhou</span>
        <div className="flex items-center gap-2">
          <QuickExplore onSelect={jumpToWork} searchRequest={searchRequest} />
          <a href={`mailto:${profile.email}?subject=Resume%20request`} className="portfolio-link resume-link" aria-label="Request résumé"><IconFile size={14} /><span className="resume-long">Request résumé</span><span className="resume-short">Résumé</span></a>
        </div>
      </header>

      <main id="main">
        <motion.section aria-labelledby="intro-title" className="portfolio-intro" variants={introStagger} initial={reduce ? false : 'hidden'} animate="show">
          <motion.p variants={rise} className="role-eyebrow"><span className="role-eyebrow-dot" aria-hidden="true" />Forward Deployed Engineer · AI systems<span className="role-eyebrow-extra"> · Software</span></motion.p>
          <motion.div variants={rise} className="intro-heading"><AnimatedIntro /><ElementSignature /></motion.div>
          <motion.p variants={rise} className="mt-5 text-[17px] leading-relaxed text-fg sm:text-[19px]">I embed with teams and ship AI that runs their real work.<br />Currently a Forward Deployed Engineering Intern at <button type="button" onClick={e => onOpen('ecobee', originOf(e))} className="link-u">ecobee</button>.</motion.p>
          <motion.p variants={rise} className="mt-4 max-w-[590px] text-[15px] leading-[1.8]">I build agents, evaluation harnesses and full-stack software, then wire them into the tools people already use: Excel, BigQuery and internal APIs. Computer Science & Finance at Waterloo.</motion.p>
          <motion.ul variants={rise} className="impact-strip" aria-label="Selected impact">
            {impact.map(m => <li key={m.label}><span className="impact-value">{m.value}</span><span className="impact-label">{m.label}</span></li>)}
          </motion.ul>
          <motion.ol variants={rise} className="fde-loop" aria-label="How I work">
            {loop.map((s, i) => <li key={s.step}><span className="fde-loop-index">0{i + 1}</span><span className="fde-loop-step">{s.step}</span><span className="fde-loop-detail">{s.detail}</span></li>)}
          </motion.ol>
          <motion.div variants={rise} className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
            <button type="button" onClick={onCopy} className="portfolio-link" aria-label={`Copy email address: ${profile.email}`}><IconCopy size={14} />Email</button>
            <a href={profile.socials[0].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconGitHub size={15} />GitHub</a>
            <a href={profile.socials[1].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconLinkedIn size={15} />LinkedIn</a>
            <a href={profile.socials[2].href} target="_blank" rel="noreferrer noopener" className="portfolio-link">Devpost<IconArrowUpRight size={13} /></a>
          </motion.div>
        </motion.section>

        <details className="focus-route"><summary>Explore by focus: AI agents, evaluation, full-stack & applied AI builds</summary><FocusExplorer onSelect={jumpToWork} /></details>

        <div ref={tabsRef} role="tablist" aria-label="Explore my work" className="portfolio-tabs">
          {sections.map(tab => <button key={tab} type="button" role="tab" id={`tab-${tab}`} aria-selected={section === tab} aria-controls={`panel-${tab}`} tabIndex={section === tab ? 0 : -1}
            ref={el => { tabRefs.current[tab] = el }} onClick={() => selectSection(tab)} onKeyDown={event => onTabKey(event, tab)}>
            {tab === 'experience' ? 'Experience' : 'Projects'}<span aria-hidden="true">{tab === 'experience' ? experience.length : works.length}</span>
            {section === tab && <motion.span className="portfolio-tab-indicator" layoutId="portfolio-tab-indicator" aria-hidden="true" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} />}
          </button>)}
        </div>

        <section id="panel-experience" role="tabpanel" aria-labelledby="tab-experience" hidden={section !== 'experience'} tabIndex={0} className="portfolio-panel">
          <h2 className="sr-only">Experience</h2>
          <p className="mb-2 text-[12px] text-faint">Deployments · internships & part-time contract work</p>
          <ol className="divide-y divide-line">
            {experience.map(d => <motion.li key={d.id} id={`experience-${d.id}`} tabIndex={-1} className="experience-row glide-row" {...expGlide.bind(d.id)}
              initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -24px 0px' }} transition={{ duration: reduce ? 0 : .45 }}>
              <Highlight show={expGlide.hovered === d.id} group="experience" />
              <div className="experience-mark"><OrgMark mark={d.mark} bg={d.markBg} fg={d.markFg} size={36} /></div>
              <div className="min-w-0">
                <div className="experience-heading">
                  <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-fg">{d.org}{d.id === 'ecobee' && <span className="now-badge">Now</span>}</h3>
                  <span className="text-[11.5px] text-faint">{d.period}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-fg">{d.role}</p>
                <p className="mt-1 text-[11.5px]"><span className="growth-ink">{d.employmentType}</span><span className="text-faint"> · {d.place}</span></p>
                <p className="mt-2 text-[13px] leading-[1.7]">{experienceSummary[d.id]}</p>
                {d.embeddedWith?.length > 0 && <p className="embedded-with"><span>Embedded with</span>{d.embeddedWith.join(' · ')}</p>}
                <p className="experience-result"><span>Outcome</span>{d.result}</p>
                <TechnologyTags items={d.stack} label={`Tools and skills used at ${d.org}`} onExplore={exploreTechnology} />
                <details className="project-story mt-1">
                  <summary aria-label={`Read about my work at ${d.org}`}>What I worked on</summary>
                  <div className="pb-3"><p>{d.shipped}</p>
                    {d.id === 'ecobee' && <button type="button" onClick={e => onOpen('ecobee', originOf(e))} className="portfolio-link mt-2">Inside my ecobee internship<IconArrowRight size={13}/></button>}
                  </div>
                </details>
              </div>
            </motion.li>)}
          </ol>

          <section aria-labelledby="toolkit-title" className="portfolio-subsection">
            <h2 id="toolkit-title" className="portfolio-section-title">Technical toolkit</h2>
            <p className="mt-2 text-[13px] leading-[1.65]">What I use to build, integrate and evaluate AI systems in production workflows.</p>
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
            <button type="button" onClick={e => onOpen('before', originOf(e))} className="portfolio-link mt-3">More about my background<IconArrowRight size={13}/></button>
          </section>

          <section aria-labelledby="recognition-title" className="portfolio-subsection">
            <h2 id="recognition-title" className="portfolio-section-title">A few milestones</h2>
            <ul className="mt-4 divide-y divide-line">{recognition.map(r => <li key={r.id} className="milestone py-4"><div className="experience-heading"><h3 className="text-[14px] font-medium text-fg">{r.title}</h3><span className="text-[12px] text-faint">{r.date}</span></div><p className="mt-1 text-[12px]">{r.issuer}</p></li>)}</ul>
          </section>
        </section>

        <section id="panel-projects" role="tabpanel" aria-labelledby="tab-projects" hidden={section !== 'projects'} tabIndex={0} className="portfolio-panel">
          <ProjectIndex onOpen={onProjectOpen} onExplore={exploreTechnology} />
        </section>
      </main>

      <footer className="portfolio-footer">
        <p className="font-serif text-[27px] text-fg">Have a workflow that should run itself<span className="signature-period">?</span></p>
        <p className="mt-1 max-w-[520px] text-[13px] leading-[1.65]">I'm interested in forward deployed, AI and software engineering roles. Tell me about the team and the problem.</p>
        <a href={`mailto:${profile.email}`} className="portfolio-link break-all">{profile.email}<IconArrowUpRight size={14}/></a>
        <p className="mt-5 text-[11px] text-faint">Caesar Zhou · Toronto & Waterloo</p>
      </footer>
    </div>
    <Dock groups={dock} />
    </>
  )
}
