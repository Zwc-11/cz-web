import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { experience } from '../content/portfolio'
import { profile } from '../content/profile'
import { education, hackathons, orgLogos, projectCards, type CardLink, type Cover } from '../content/onepage'
import type { TakeId } from '../content/takes'
import type { Theme } from '../hooks/useTheme'
import {
  IconBriefcase, IconChevronRight, IconDevpost, IconFile, IconGitHub, IconGlobe, IconHome, IconLayers, IconLinkedIn, IconMail, IconTrophy, IconYouTube,
} from './icons'
import { AnimatedIntro } from './AnimatedIntro'
import { Dock, ThemeGlyph, type DockItem } from './Dock'
import '../styles/interactions.css'
import '../styles/onepage.css'

export type Origin = { top: number; left: number; width: number; height: number }

const originOf = (e: MouseEvent<HTMLElement>): Origin => {
  const r = e.currentTarget.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

const experienceSummary: Record<string, string> = {
  ecobee: 'Embedded with finance, accounting and sales. Shipped 30+ tools, 15+ agents and 25+ reusable AI skills (Python, Claude, MCP) wired into Excel, BigQuery and internal APIs. Users save 2+ hours of manual work a day.',
  wdi: 'Owned an agentic marketing platform end to end: research, SEO/GEO, lead qualification and content, plus its data and review layer. Helped acquire 70+ clients; the ad agent lifted weekly traffic 82%.',
  gore: 'Built a LangGraph RAG system and a ReAct analytics agent for underwriting and actuarial teams. 89.5% strict accuracy on 200+ labeled questions, with evaluation runtime cut 80%.',
  csaa: 'Coached FRC and VEX students in CAD, robot bring-up and C++ PID control. Built a React / Electron / Python firmware and SDK generator for STM32 and Arduino setup.',
  brandeq: 'Led a student development team through client discovery, design and delivery of websites for community organisations.',
}

type SectionId = 'top' | 'experience' | 'projects' | 'hackathons'

function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId>('top')
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id as SectionId)
    }, { rootMargin: '-35% 0px -60% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const sectionIds: SectionId[] = ['top', 'experience', 'projects', 'hackathons']

function Section({ id, title, children, intro }: { id: string; title: string; children: ReactNode; intro?: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-title`} className="op-section">
    <h2 id={`${id}-title`} className="op-h2">{title}</h2>
    {intro && <p className="op-intro">{intro}</p>}
    {children}
  </section>
}

function Logo({ src, mark, bg, fg, size = 44 }: { src?: string; mark: string; bg: string; fg: string; size?: number }) {
  if (src) return <span className="op-logo" style={{ width: size, height: size }}><img src={src} alt="" width={size} height={size} loading="lazy" /></span>
  return <span className="op-logo op-logo-mark" aria-hidden="true" style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.4 }}>{mark}</span>
}

const linkIcon = (kind: CardLink['kind']) => {
  switch (kind) {
    case 'github': return <IconGitHub size={14} />
    case 'devpost': return <IconDevpost size={14} />
    case 'youtube': return <IconYouTube size={14} />
    default: return <IconGlobe size={14} />
  }
}

function Chips({ links, name }: { links: CardLink[]; name: string }) {
  return <div className="op-chips">
    {links.map(l => <a key={l.href + l.label} className="op-chip" href={l.href} target="_blank" rel="noreferrer noopener" aria-label={`${name}: ${l.label} (opens in a new tab)`}>
      {linkIcon(l.kind)}{l.label}
    </a>)}
  </div>
}

function CoverArt({ cover, name }: { cover: Cover; name: string }) {
  if (cover.kind === 'photo') return <div className="op-cover"><img src={cover.src} alt={`${name} preview`} loading="lazy" style={{ objectPosition: cover.position }} /></div>
  return <div className="op-cover op-cover-framed" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${cover.to} 0%, ${cover.from} 70%)` }}>
    <img src={cover.src} alt={`${name} screenshot`} loading="lazy" style={{ objectPosition: cover.position ?? '0% 0%' }} />
  </div>
}

function SkillTabs() {
  const [group, setGroup] = useState(0)
  const reduce = useReducedMotion()
  return <div>
    <div className="op-skill-tabs" role="tablist" aria-label="Skill groups">
      {profile.skills.map((g, i) => <button key={g.group} type="button" role="tab" aria-selected={group === i} aria-controls="skill-panel" id={`skill-tab-${i}`} onClick={() => setGroup(i)}>
        {group === i && <motion.span layoutId="skill-pill" className="op-skill-pill" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}
        <span className="relative">{g.group}</span>
      </button>)}
    </div>
    <div id="skill-panel" role="tabpanel" aria-labelledby={`skill-tab-${group}`} className="op-skill-list">
      {profile.skills[group].items.map(s => <span key={s} className="op-skill">{s}</span>)}
    </div>
  </div>
}

export function Home({ theme, onTheme, onOpen, onCopy, onProjectOpen }: {
  theme: Theme
  onTheme: (o?: { x: number; y: number }) => void
  onOpen: (id: TakeId, origin?: Origin) => void
  onCopy: () => void
  onProjectOpen: (id: string) => void
}) {
  const reduce = useReducedMotion()
  const active = useActiveSection(sectionIds)
  const behavior: ScrollBehavior = reduce ? 'instant' : 'smooth'
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })

  // Old ?tab=projects links land on the projects section.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'projects' && !params.get('project')) requestAnimationFrame(() => go('projects'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCase = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onProjectOpen(id)
  }

  const wins = hackathons.filter(h => h.won).length

  const dock: DockItem[][] = [
    [
      { id: 'home', label: 'Home', icon: <IconHome size={19} />, active: active === 'top', onClick: () => window.scrollTo({ top: 0, behavior }) },
      { id: 'experience', label: 'Experience', icon: <IconBriefcase size={19} />, active: active === 'experience', onClick: () => go('experience') },
      { id: 'projects', label: 'Projects', icon: <IconLayers size={19} />, active: active === 'projects', onClick: () => go('projects') },
      { id: 'hackathons', label: 'Hackathons', icon: <IconTrophy size={19} />, active: active === 'hackathons', onClick: () => go('hackathons') },
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

  return <>
    <div className="op-shell">
      <a href="#main" className="portfolio-skip">Skip to content</a>
      <main id="main">
        {/* ------------------------------------------------------------ intro */}
        <section id="top" aria-labelledby="intro-title" className="op-hero">
          <div className="op-hero-text">
            <AnimatedIntro />
            <p className="op-role">Forward Deployed Engineer · AI systems · Software</p>
            <div className="op-lines">
              <p>I embed with teams and ship AI that runs their real work.</p>
              <p>Currently a Forward Deployed Engineering Intern at <button type="button" className="op-inline-link" onClick={e => onOpen('ecobee', originOf(e))}>ecobee</button>.</p>
              <p>Computer Science & Finance at Waterloo.</p>
              <p>Hack the North 2026 finalist, with the highest score of the 12 finalists.</p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- experience */}
        <Section id="experience" title="Experience">
          <ol className="op-list">
            {experience.map(d => <li key={d.id} id={`experience-${d.id}`} className="op-row-wrap">
              <details className="op-details">
                <summary className="op-row">
                  <Logo src={orgLogos[d.id]} mark={d.mark} bg={d.markBg} fg={d.markFg} />
                  <span className="op-row-main">
                    <span className="op-row-title">{d.org}<IconChevronRight size={14} className="op-chevron" />{d.id === 'ecobee' && <span className="op-now">Now</span>}</span>
                    <span className="op-row-sub">{d.role}</span>
                  </span>
                  <span className="op-row-date">{d.period}</span>
                </summary>
                <div className="op-row-body">
                  <p>{experienceSummary[d.id]}</p>
                  <p className="op-meta">{d.employmentType} · {d.place}</p>
                  <div className="op-tags">{d.stack.map(s => <span key={s}>{s}</span>)}</div>
                  {d.id === 'ecobee' && <button type="button" className="op-more" onClick={e => onOpen('ecobee', originOf(e))}>Inside my ecobee internship<IconChevronRight size={13} /></button>}
                </div>
              </details>
            </li>)}
          </ol>
        </Section>

        {/* -------------------------------------------------------- education */}
        <Section id="education" title="Education">
          <div className="op-row op-row-static">
            <Logo src={education.logo} mark="W" bg="#000" fg="#fde047" />
            <span className="op-row-main">
              <span className="op-row-title">{education.school}</span>
              <span className="op-row-sub">{education.program}</span>
            </span>
            <span className="op-row-date">{education.period}</span>
          </div>
          <ul className="op-tree">
            {education.items.map(i => <li key={i.title}>
              <span className="op-row-main">
                <span className="op-row-title op-row-title-sm">{i.title}</span>
                <span className="op-row-sub">{i.sub}</span>
              </span>
              <span className="op-row-date">{i.date}</span>
            </li>)}
          </ul>
          <button type="button" className="op-more op-more-indent" onClick={e => onOpen('before', originOf(e))}>More about my background<IconChevronRight size={13} /></button>
        </Section>

        {/* ----------------------------------------------------------- skills */}
        <Section id="skills" title="Skills"><SkillTabs /></Section>

        {/* --------------------------------------------------------- projects */}
        <Section id="projects" title="Things I've built" intro="AI agents, evaluation harnesses, data systems and a few robots.">
          <div className="op-grid">
            {projectCards.map(p => <motion.article key={p.id} id={`project-${p.id}`} className="op-card"
              initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 0.8, 0.2, 1] }}>
              <a href={`?project=${p.id}`} onClick={e => openCase(e, p.id)} className="op-card-media" aria-label={`Open the ${p.name} case study`}>
                <CoverArt cover={p.cover} name={p.name} />
                {p.badge && <span className="op-badge"><IconTrophy size={12} />{p.badge}</span>}
              </a>
              <div className="op-card-body">
                <h3 className="op-card-title"><a href={`?project=${p.id}`} onClick={e => openCase(e, p.id)}>{p.name}</a></h3>
                <p className="op-card-date">{p.date}</p>
                <p className="op-card-text">{p.blurb}</p>
                <div className="op-card-foot">
                  <Chips links={p.links} name={p.name} />
                  <a href={`?project=${p.id}`} onClick={e => openCase(e, p.id)} className="op-case">Case study<IconChevronRight size={13} /></a>
                </div>
              </div>
            </motion.article>)}
          </div>
        </Section>

        {/* ------------------------------------------------------- hackathons */}
        <Section id="hackathons" title="Hackathons" intro={`${hackathons.length} hackathons, ${wins} with awards. Mostly AI + hardware builds.`}>
          <ol className="op-timeline">
            {hackathons.map(h => <li key={h.id} className="op-event">
              <span className="op-event-icon">{h.icon ? <img src={h.icon} alt="" width={40} height={40} loading="lazy" /> : <span className="op-event-mark" style={{ background: h.mark!.bg, color: h.mark!.fg }}>{h.mark!.text}</span>}</span>
              <div className="op-event-body">
                <p className="op-event-date">{h.date}</p>
                <h3 className="op-event-title">{h.name}{h.won && <span role="img" aria-label="award winner"> 🏆</span>}</h3>
                <p className="op-event-place">{h.place}</p>
                {h.lines.map(l => <p key={l} className="op-event-text">{l}</p>)}
                {h.wins.map(w => <p key={w} className="op-won"><span>Won</span> {w}</p>)}
                <div className="op-event-foot">
                  <Chips links={h.links} name={h.name} />
                  <a href={`?project=${h.projectId}`} onClick={e => openCase(e, h.projectId)} className="op-case">Case study<IconChevronRight size={13} /></a>
                </div>
              </div>
            </li>)}
          </ol>
        </Section>

        {/* ---------------------------------------------------------- contact */}
        <section id="contact" aria-labelledby="contact-title" className="op-section op-contact">
          <h2 id="contact-title" className="op-h2">Found me interesting?</h2>
          <p className="op-intro">I'm interested in forward deployed, AI and software engineering roles. Email me at <a className="op-inline-link" href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <div className="op-socials">
            <a href={profile.socials[0].href} target="_blank" rel="noreferrer noopener" aria-label="GitHub"><IconGitHub size={20} /></a>
            <a href={profile.socials[1].href} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn"><IconLinkedIn size={20} /></a>
            <a href={profile.socials[2].href} target="_blank" rel="noreferrer noopener" aria-label="Devpost"><IconDevpost size={20} /></a>
            <a href={`mailto:${profile.email}?subject=Resume%20request`} className="op-resume"><IconFile size={15} />Request résumé</a>
          </div>
          <p className="op-foot">Caesar Zhou · Toronto & Waterloo</p>
        </section>
      </main>
    </div>
    <Dock groups={dock} />
  </>
}
