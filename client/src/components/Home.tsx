import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { caseStudies } from '../content/caseStudies'
import { experience } from '../content/experience'
import { profile } from '../content/profile'
import { education, featureSlides, hackathons, projectCards, type Cover } from '../content/onepage'
import type { Theme } from '../hooks/useTheme'
import { IconArrowUpRight, IconBriefcase, IconCopy, IconDevpost, IconGitHub, IconHome, IconLayers, IconLinkedIn, IconMail, IconTrophy, IconX } from './icons'
import { AnimatedIntro } from './AnimatedIntro'
import { ElementSignature } from './ElementSignature'
import { FeatureCarousel } from './FeatureCarousel'
import { LoopVideo } from './LoopVideo'
import { Dock, ThemeGlyph, type DockItem } from './Dock'
import '../styles/onepage.css'

const ease = [0.22, 0.8, 0.2, 1] as const
const introStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const rise = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}

const featured = projectCards.filter(p => p.featured)

type SectionId = 'top' | 'experience' | 'projects' | 'hackathons'
const sectionIds: SectionId[] = ['top', 'experience', 'projects', 'hackathons']

/** The section under the reading line, for the dock's highlight. */
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

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-title`} className="op-section">
    <h2 id={`${id}-title`} className="op-h2">{title}</h2>
    {children}
  </section>
}

function Logo({ src, mark }: { src?: string; mark?: { text: string; bg: string; fg: string } }) {
  if (src) return <span className="op-logo"><img src={src} alt="" width={36} height={36} loading="lazy" /></span>
  if (mark) return <span className="op-logo op-logo-mark" aria-hidden="true" style={{ background: mark.bg, color: mark.fg }}>{mark.text}</span>
  return <span className="op-logo op-logo-empty" aria-hidden="true" />
}

function CoverArt({ cover, name }: { cover: Cover; name: string }) {
  if (cover.kind === 'video') return <div className="op-cover op-cover-video"><LoopVideo src={cover.src} webm={cover.webm} poster={cover.poster} label={`${name} demo clip`} /></div>
  if (cover.kind === 'photo') return <div className="op-cover"><img src={cover.src} alt="" loading="lazy" style={{ objectPosition: cover.position }} /></div>
  return <div className="op-cover op-cover-framed" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${cover.to} 0%, ${cover.from} 70%)` }}>
    <img src={cover.src} alt="" loading="lazy" style={{ objectPosition: cover.position ?? '0% 0%' }} />
  </div>
}

export function Home({ theme, onTheme, onCopy, onProjectOpen }: {
  theme: Theme
  onTheme: (o?: { x: number; y: number }) => void
  onCopy: () => void
  onProjectOpen: (id: string) => void
}) {
  const reduce = useReducedMotion()
  const behavior: ScrollBehavior = reduce ? 'instant' : 'smooth'
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })

  // Old links: ?tab=projects and #projects land on Projects, #ecobee on the ecobee
  // role, #before on Education, #takeone opens its case study.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hash = window.location.hash.replace(/^#\/?/, '')
    const target = ({ ecobee: 'experience-ecobee', before: 'education', projects: 'projects' } as Record<string, string>)[hash]
      ?? (params.get('tab') === 'projects' && !params.get('project') ? 'projects' : undefined)
    if (target) requestAnimationFrame(() => go(target))
    else if (hash === 'takeone') onProjectOpen('takeone')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Opens a case study in place; modified clicks keep their browser behavior. */
  const openCase = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onProjectOpen(id)
  }
  const caseLink = (id: string) => ({ href: `?project=${id}`, onClick: (e: MouseEvent<HTMLAnchorElement>) => openCase(e, id) })

  const active = useActiveSection(sectionIds)
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
      { id: 'x', label: 'X', icon: <IconX size={18} />, href: profile.socials[3].href },
      { id: 'devpost', label: 'Devpost', icon: <IconDevpost size={19} />, href: profile.socials[2].href },
    ],
    [
      {
        id: 'theme', label: theme === 'dark' ? 'Light mode  T' : 'Dark mode  T', icon: <ThemeGlyph theme={theme} />,
        onClick: e => { const r = e.currentTarget.getBoundingClientRect(); onTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 }) },
      },
    ],
  ]

  return <div className="op-shell">
    <a href="#main" className="portfolio-skip">Skip to content</a>
    <header className="op-header">
      <span className="op-namemark">Caesar Zhou</span>
      <nav className="op-nav" aria-label="Site">
        <a href={`mailto:${profile.email}?subject=Resume%20request`} className="op-nav-link">Résumé</a>
      </nav>
    </header>

    <main id="main">
      <motion.section id="top" aria-labelledby="intro-title" className="op-hero" variants={introStagger} initial={reduce ? false : 'hidden'} animate="show">
        <motion.div variants={rise} className="intro-heading"><AnimatedIntro /><ElementSignature /></motion.div>
        <motion.p variants={rise} className="op-lede">I'm a 2B Computer Science &amp; Finance student at the{' '}
          <span className="op-org"><img className="op-org-logo" src={education.logo} alt="" width={18} height={18} />University of Waterloo</span>.</motion.p>
        <motion.div variants={rise} className="op-recent">
          <h2 className="op-recent-label">Recently</h2>
          <ul className="op-recent-list">
            <li>
              <p>AI Adoption &amp; Deployment Engineering Intern at{' '}
                <button type="button" className="op-org op-org-link" onClick={() => go('experience-ecobee')}>
                  <img className="op-org-logo op-org-logo-round" src="logos/ecobee.png" alt="" width={18} height={18} />ecobee</button></p>
              <p className="op-recent-sub"><span aria-hidden="true">↳ </span>Forward-deployed with finance, accounting and sales teams</p>
            </li>
            <li>
              <p>Building <a className="op-org op-org-link" {...caseLink('takeone')}>TakeOne</a>, an OpenAI-supported venture</p>
              <p className="op-recent-sub"><span aria-hidden="true">↳ </span>An AI robot film studio from{' '}
                <span className="op-org-plain"><img className="op-org-logo" src="logos/htn.png" alt="" width={16} height={16} />Hack the North 2026</span>, top score of 12 finalists</p>
            </li>
            <li>
              <p>Built SproutPass at{' '}
                <a className="op-org op-org-link" {...caseLink('sproutpass')}>
                  <img className="op-org-logo" src="logos/lahacks.png" alt="" width={18} height={18} />LA Hacks 2026</a></p>
              <p className="op-recent-sub"><span aria-hidden="true">↳ </span>Visa Challenge Winner, Photon iMessage Runner-Up</p>
            </li>
          </ul>
          <p className="op-recent-also">I also build robots after hours <span>(and used to coach FRC and VEX teams)</span></p>
        </motion.div>
        <motion.div variants={rise} className="op-links">
          <button type="button" onClick={onCopy} className="portfolio-link" aria-label={`Copy email address: ${profile.email}`}><IconCopy size={14} />Email</button>
          <a href={profile.socials[0].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconGitHub size={15} />GitHub</a>
          <a href={profile.socials[1].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconLinkedIn size={15} />LinkedIn</a>
          <a href={profile.socials[3].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconX size={14} />X</a>
          <a href={profile.socials[2].href} target="_blank" rel="noreferrer noopener" className="portfolio-link">Devpost<IconArrowUpRight size={13} /></a>
        </motion.div>
        <motion.div variants={rise}><FeatureCarousel slides={featureSlides} label="TakeOne at Hack the North 2026" /></motion.div>
      </motion.section>

      <Section id="experience" title="Experience">
        <ol className="op-rows">
          {experience.map(r => <li key={r.id} id={`experience-${r.id}`} className="op-row">
            <Logo src={r.logo} mark={r.mark} />
            <div className="op-row-main">
              <h3 className="op-row-title">{r.org}</h3>
              <p className="op-row-sub">{r.role}</p>
              <p className="op-row-text">{r.highlight}</p>
            </div>
            <span className="op-date">{r.period}</span>
          </li>)}
        </ol>
      </Section>

      <Section id="projects" title="Projects">
        <ul className="op-grid">
          {featured.map(p => <li key={p.id}>
            <a className="op-card" {...caseLink(p.id)}>
              <CoverArt cover={p.cover} name={p.name} />
              {p.award && <span className="op-badge"><IconTrophy size={12} />{p.award}</span>}
              <span className="op-card-body">
                <span className="op-card-title">{p.name}</span>
                <span className="op-card-text">{caseStudies[p.id].overview}</span>
              </span>
            </a>
          </li>)}
        </ul>
      </Section>

      <Section id="hackathons" title="Hackathons">
        <ol className="op-rows">
          {hackathons.map(h => <li key={h.id}>
            <a className="op-row op-row-link" {...caseLink(h.projectId)}>
              <Logo src={h.icon} mark={h.mark} />
              <span className="op-row-main">
                <span className="op-row-title">{h.name}</span>
                <span className="op-row-sub">{h.project}{h.award && <> · <span className="op-award">{h.award}</span></>}</span>
              </span>
              <span className="op-date">{h.date}</span>
            </a>
          </li>)}
        </ol>
      </Section>

      <Section id="education" title="Education">
        <ol className="op-rows">
          <li className="op-row">
            <Logo src={education.logo} />
            <div className="op-row-main">
              <h3 className="op-row-title">{education.school}</h3>
              <p className="op-row-sub">{education.program}</p>
            </div>
            <span className="op-date">{education.period}</span>
          </li>
          <li>
            <a className="op-row op-row-link" {...caseLink(education.award.projectId)}>
              <Logo />
              <span className="op-row-main">
                <span className="op-row-title op-award">{education.award.title}</span>
              </span>
              <span className="op-date">{education.award.date}</span>
            </a>
          </li>
        </ol>
      </Section>
    </main>

    <footer className="op-footer">
      <a href={`mailto:${profile.email}`} className="op-footer-mail">{profile.email}</a>
      <span>Toronto &amp; Waterloo</span>
    </footer>
    <Dock groups={dock} />
  </div>
}
