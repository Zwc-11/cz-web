import { useEffect, useState, type MouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type SyntheticEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { experience } from '../content/portfolio'
import { profile } from '../content/profile'
import { caseStudies } from '../content/caseStudies'
import { education, featureSlides, hackathons, htnPhoto, orgLogos, projectCards, type CardLink, type Cover } from '../content/onepage'
import type { TakeId } from '../content/takes'
import type { Theme } from '../hooks/useTheme'
import {
  IconArrowUpRight, IconBriefcase, IconChevronRight, IconCopy, IconDevpost, IconFile, IconGitHub, IconGlobe, IconHome, IconLayers, IconLinkedIn, IconMail, IconTrophy, IconYouTube,
} from './icons'
import { AnimatedIntro } from './AnimatedIntro'
import { ElementSignature } from './ElementSignature'
import { QuickExplore, type ExploreSelection } from './QuickExplore'
import { FeatureCarousel } from './FeatureCarousel'
import { LoopVideo } from './LoopVideo'
import { CountUp, Emphasize, GradientText, ShinyText } from './Highlight'
import { Dock, ThemeGlyph, type DockItem } from './Dock'
import '../styles/interactions.css'
import '../styles/onepage.css'

export type Origin = { top: number; left: number; width: number; height: number }

const originOf = (e: MouseEvent<HTMLElement>): Origin => {
  const r = e.currentTarget.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

const ease = [0.22, 0.8, 0.2, 1] as const
const introStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const rise = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}

const experienceSummary: Record<string, string> = {
  ecobee: 'Embedded with finance, accounting and sales teams, turning manual close, reconciliation and reporting work into governed AI agents and tools.',
  wdi: 'Owned an agentic marketing platform end to end: research, SEO/GEO, lead qualification and content, plus its data and review layer.',
  gore: 'Built and evaluated a RAG system and an analytics agent for underwriting and actuarial teams, measured on 200+ labeled questions.',
  csaa: 'Wrote and taught C++ control software, and built a firmware/SDK generator that removed repeated embedded setup for student teams.',
  brandeq: 'Ran client discovery and delivery for community-organisation websites, leading a student development team.',
}

type SectionId = 'top' | 'experience' | 'projects' | 'hackathons'
const sectionIds: SectionId[] = ['top', 'experience', 'projects', 'hackathons']

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

function Section({ id, index, label, title, intro, children }: { id: string; index: string; label: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-title`} className="op-section">
    <p className="op-label"><span>{index}</span><i aria-hidden="true" />{label}</p>
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
  if (cover.kind === 'video') return <div className="op-cover op-cover-video"><LoopVideo src={cover.src} webm={cover.webm} poster={cover.poster} label={`${name} demo clip`} /></div>
  if (cover.kind === 'photo') return <div className="op-cover"><img src={cover.src} alt={`${name} preview`} loading="lazy" style={{ objectPosition: cover.position }} /></div>
  return <div className="op-cover op-cover-framed" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${cover.to} 0%, ${cover.from} 70%)` }}>
    <img src={cover.src} alt={`${name} screenshot`} loading="lazy" style={{ objectPosition: cover.position ?? '0% 0%' }} />
  </div>
}

/** Uses the fallback image once if the primary file is missing. */
const useFallback = (fallback: string) => (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget
  if (img.dataset.fallback) return
  img.dataset.fallback = 'true'
  img.src = fallback
}

/** Every skill group at once, so the full toolkit can be scanned without clicking. */
function SkillGrid() {
  return <div className="op-skill-grid">
    {profile.skills.map((g, i) => <section key={g.group} className={`op-skill-group${i === 0 ? ' op-skill-group-lead' : ''}`} aria-labelledby={`skill-group-${i}`}>
      <h3 id={`skill-group-${i}`} className="op-skill-group-title">{g.group}</h3>
      <ul className="op-skill-list">{g.items.map(s => <li key={s} className="op-skill">{s}</li>)}</ul>
    </section>)}
  </div>
}

/** Soft light that follows the pointer inside a card (after React Bits' Spotlight Card). */
const trackSpotlight = (e: ReactPointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
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
  const photoFallback = useFallback(htnPhoto.fallback)

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

  const jumpToWork = (selection: ExploreSelection) => {
    if (selection.kind === 'project') { onProjectOpen(selection.id); return }
    const row = document.getElementById(`experience-${selection.id}`)
    row?.scrollIntoView({ behavior, block: 'start' })
    const detail = row?.querySelector('details')
    if (detail) detail.open = true
  }

  const showRole = (id: string) => jumpToWork({ kind: 'experience', id })

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
      <header className="op-header">
        <span className="op-namemark">Caesar Zhou</span>
        <div className="flex items-center gap-2">
          <QuickExplore onSelect={jumpToWork} />
          <a href={`mailto:${profile.email}?subject=Resume%20request`} className="portfolio-link resume-link" aria-label="Request résumé"><IconFile size={14} /><span className="resume-long">Request résumé</span><span className="resume-short">Résumé</span></a>
        </div>
      </header>

      <main id="main">
        {/* ------------------------------------------------------------ intro */}
        <motion.section id="top" aria-labelledby="intro-title" className="op-hero" variants={introStagger} initial={reduce ? false : 'hidden'} animate="show">
          <motion.div variants={rise} className="intro-heading"><AnimatedIntro /><ElementSignature /></motion.div>
          <motion.p variants={rise} className="op-lede">i'm a 2B computer science &amp; finance student at{' '}
            <span className="op-org"><img className="op-org-logo" src={education.logo} alt="" width={18} height={18} />university of waterloo</span>.</motion.p>
          <motion.div variants={rise} className="op-recent">
            <p className="op-recent-label">recently</p>
            <ul className="op-recent-list">
              <li>
                <p>ai adoption &amp; deployment engineering intern at{' '}
                  <button type="button" className="op-org op-org-link" onClick={e => onOpen('ecobee', originOf(e))} aria-label="ecobee: open my current internship">
                    <img className="op-org-logo op-org-logo-round" src={orgLogos.ecobee} alt="" width={18} height={18} />ecobee</button></p>
                <p className="op-recent-sub"><span aria-hidden="true">↳ </span>forward-deployed with finance, accounting and sales teams</p>
              </li>
              <li>
                <p>full-stack ai engineer at{' '}
                  <button type="button" className="op-org op-org-link" onClick={() => showRole('wdi')}>wealthy doctor institute</button></p>
                <p className="op-recent-sub"><span aria-hidden="true">↳ </span>built their agentic marketing platform end to end</p>
              </li>
              <li>
                <p>data scientist &amp; ai platform engineer at{' '}
                  <button type="button" className="op-org op-org-link" onClick={() => showRole('gore')}>
                    <img className="op-org-logo" src={orgLogos.gore} alt="" width={18} height={18} />gore mutual</button></p>
              </li>
            </ul>
            <p className="op-recent-also">i also build robots after hours <span>(TakeOne, a Hack the North 2026 finalist)</span></p>
          </motion.div>
          <motion.div variants={rise} className="op-links">
            <button type="button" onClick={onCopy} className="portfolio-link" aria-label={`Copy email address: ${profile.email}`}><IconCopy size={14} />Email</button>
            <a href={profile.socials[0].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconGitHub size={15} />GitHub</a>
            <a href={profile.socials[1].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconLinkedIn size={15} />LinkedIn</a>
            <a href={profile.socials[2].href} target="_blank" rel="noreferrer noopener" className="portfolio-link">Devpost<IconArrowUpRight size={13} /></a>
          </motion.div>

          <motion.ul variants={rise} className="op-stats" aria-label="Highlights">
            <li><span className="op-stat-value"><CountUp to={30} suffix="+" /></span><span className="op-stat-label">AI tools shipped at ecobee</span></li>
            <li><span className="op-stat-value"><CountUp to={89.5} decimals={1} suffix="%" /></span><span className="op-stat-label">strict accuracy, Gore Mutual RAG</span></li>
            <li><span className="op-stat-value"><CountUp to={70} suffix="+" /></span><span className="op-stat-label">clients acquired at WDI</span></li>
            <li className="op-stat-gold"><span className="op-stat-value"><GradientText>#<CountUp to={1} /></GradientText></span><span className="op-stat-label">score of 12 Hack the North finalists</span></li>
          </motion.ul>

          <motion.div variants={rise}><FeatureCarousel slides={featureSlides} badge="Hack the North 2026 · Finalist" title="TakeOne at Hack the North 2026" /></motion.div>
        </motion.section>

        {/* ------------------------------------------------------- experience */}
        <Section id="experience" index="01" label="Deployments" title="Experience" intro="Internships and part-time contract work, most recent first.">
          <ol className="op-xp">
            {experience.map(d => <motion.li key={d.id} id={`experience-${d.id}`} className={`op-xp-item${d.id === 'ecobee' ? ' op-xp-featured' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -30px 0px' }} transition={{ duration: reduce ? 0 : 0.5, ease }}>
              <span className="op-xp-node"><Logo src={orgLogos[d.id]} mark={d.mark} bg={d.markBg} fg={d.markFg} size={40} /></span>
              <div className="op-xp-body">
                <p className="op-xp-period">{d.period}{d.id === 'ecobee' && <span className="op-now"><i aria-hidden="true" />Current role</span>}</p>
                <h3 className="op-xp-org">{d.org}</h3>
                <p className="op-xp-role">{d.role}<span> · {d.employmentType} · {d.place}</span></p>
                <p className="op-xp-text"><Emphasize text={experienceSummary[d.id]} /></p>
                <p className="op-xp-outcome"><span>Outcome</span><span className="op-xp-result"><Emphasize text={d.result} /></span></p>
                <div className="op-tags">{d.stack.map(s => <span key={s}>{s}</span>)}</div>
                <details className="op-details">
                  <summary>What I worked on<IconChevronRight size={13} className="op-chevron" /></summary>
                  <div className="op-details-body"><p>{d.shipped}</p>
                    {d.id === 'ecobee' && <button type="button" className="op-more" onClick={e => onOpen('ecobee', originOf(e))}>Inside my ecobee internship<IconChevronRight size={13} /></button>}
                  </div>
                </details>
              </div>
            </motion.li>)}
          </ol>
        </Section>

        {/* -------------------------------------------------------- education */}
        <Section id="education" index="02" label="School" title="Education">
          <div className="op-edu">
            <Logo src={education.logo} mark="W" bg="#000" fg="#fde047" />
            <span className="op-edu-main">
              <span className="op-edu-title">{education.school}</span>
              <span className="op-edu-sub">{education.program}</span>
            </span>
            <span className="op-date">{education.period}</span>
          </div>
          <ul className="op-tree">
            {education.items.map(i => <li key={i.title}>
              <span className="op-edu-main">
                <span className="op-edu-title op-edu-title-sm">{i.title.startsWith('1st Place') ? <ShinyText tone="gold">{i.title}</ShinyText> : i.title}</span>
                <span className="op-edu-sub">{i.sub}</span>
              </span>
              <span className="op-date">{i.date}</span>
            </li>)}
          </ul>
          <button type="button" className="op-more op-more-indent" onClick={e => onOpen('before', originOf(e))}>More about my background<IconChevronRight size={13} /></button>
        </Section>

        {/* ----------------------------------------------------------- skills */}
        <Section id="skills" index="03" label="Toolkit" title="Skills" intro="What I use to find the workflow, build the AI system, wire it into existing tools and prove it works."><SkillGrid /></Section>

        {/* --------------------------------------------------------- projects */}
        <Section id="projects" index="04" label="Selected work" title="Projects" intro="Agents, evaluation, data systems and applied AI builds. Each card opens the engineering case study.">
          <div className="op-grid">
            {projectCards.map((p, n) => <motion.article key={p.id} id={`project-${p.id}`} className="op-card" onPointerMove={trackSpotlight}
              initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: reduce ? 0 : 0.5, ease }}>
              <a href={`?project=${p.id}`} onClick={e => openCase(e, p.id)} className="op-card-media" aria-label={`Open the ${p.name} case study`}>
                <CoverArt cover={p.cover} name={p.name} />
                {p.badges && <span className="op-badges">{p.badges.map(b => <span key={b} className="op-badge"><IconTrophy size={12} />{b}</span>)}</span>}
              </a>
              <div className="op-card-body">
                <p className="op-card-meta"><span>{String(n + 1).padStart(2, '0')}</span>{caseStudies[p.id]?.focus}</p>
                <h3 className="op-card-title"><a href={`?project=${p.id}`} onClick={e => openCase(e, p.id)}>{p.name}<IconArrowUpRight size={15} /></a></h3>
                <p className="op-card-date">{p.date}</p>
                <p className="op-card-text"><Emphasize text={p.blurb} /></p>
                <div className="op-card-foot">
                  <Chips links={p.links} name={p.name} />
                  <a href={`?project=${p.id}`} onClick={e => openCase(e, p.id)} className="op-case">Inside the build<IconChevronRight size={13} /></a>
                </div>
              </div>
            </motion.article>)}
          </div>
        </Section>

        {/* ------------------------------------------------------- hackathons */}
        <Section id="hackathons" index="05" label="Weekends" title="Hackathons" intro={`${hackathons.length} hackathons, ${wins} with awards. Mostly AI + hardware builds.`}>
          <ol className="op-timeline">
            {hackathons.map(h => <li key={h.id} className="op-event">
              <span className={`op-event-icon${h.iconFill ? ' op-event-icon-fill' : ''}`}>{h.icon ? <img src={h.icon} alt="" width={40} height={40} loading="lazy" /> :<span className="op-event-mark" style={{ background: h.mark!.bg, color: h.mark!.fg }}>{h.mark!.text}</span>}</span>
              <div className="op-event-body">
                <p className="op-event-date">{h.date}</p>
                <h3 className="op-event-title">{h.name}{h.won && <span role="img" aria-label="award winner"> 🏆</span>}</h3>
                <p className="op-event-place">{h.place}</p>
                {h.id === 'htn-2026' && <img className="op-event-photo" src={htnPhoto.src} onError={photoFallback} alt={htnPhoto.alt} loading="lazy" />}
                {h.photo && <img className="op-event-photo op-event-photo-fit" src={h.photo.src} alt={h.photo.alt} loading="lazy" />}
                {h.lines.map(l => <p key={l} className="op-event-text"><Emphasize text={l} /></p>)}
                {h.wins.length > 0 && <ul className="op-wins" aria-label={`Awards at ${h.name}`}>
                  {h.wins.map(w => <li key={w} className="op-win"><IconTrophy size={13} /><ShinyText tone="gold">{w}</ShinyText></li>)}
                </ul>}
                <div className="op-event-foot">
                  <Chips links={h.links} name={h.name} />
                  <a href={`?project=${h.projectId}`} onClick={e => openCase(e, h.projectId)} className="op-case">Inside the build<IconChevronRight size={13} /></a>
                </div>
              </div>
            </li>)}
          </ol>
        </Section>
      </main>

      <footer className="op-footer">
        <p className="op-footer-title">Have a workflow that should run itself<span>?</span></p>
        <p className="op-footer-text">I'm interested in AI adoption, forward-deployed AI and software engineering roles. Tell me about the team and the problem.</p>
        <a href={`mailto:${profile.email}`} className="portfolio-link break-all">{profile.email}<IconArrowUpRight size={14} /></a>
        <p className="op-foot">Caesar Zhou · Toronto & Waterloo</p>
      </footer>
    </div>
    <Dock groups={dock} />
  </>
}
