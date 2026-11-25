import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, type MouseEvent } from 'react'
import { profile } from '../content/profile'
import type { Theme } from '../hooks/useTheme'
import { usePage } from '../hooks/usePage'
import { legacyTarget, pageHref, pages, type PageId } from '../lib/pages'
import { Dock, ThemeGlyph, type DockItem } from './Dock'
import { IconBriefcase, IconDevpost, IconGitHub, IconHome, IconLayers, IconLinkedIn, IconMail, IconTrophy, IconX } from './icons'
import { isPlainClick, SiteNavContext } from './parts'
import { PixelField } from './PixelField'
import { ThemeToggle } from './ThemeToggle'
import { HackathonsPage } from './pages/HackathonsPage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { WorkPage } from './pages/WorkPage'
import '../styles/onepage.css'

const ease = [0.22, 0.8, 0.2, 1] as const

/** One page of the site. Lands on its #anchor, and takes focus after a tab switch. */
function PageFrame({ id, focus, children }: { id: PageId; focus: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    const target = hash && document.getElementById(hash)
    if (focus) ref.current?.focus({ preventScroll: true })
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }))
  }, [focus])
  return <motion.main ref={ref} id="main" tabIndex={-1} className="op-main" data-page={id}
    initial={reduce || !focus ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.42, ease } }}
    exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, filter: 'blur(2px)', transition: { duration: 0.16, ease: 'easeIn' } }}>
    {children}
  </motion.main>
}

export function Site({ theme, onTheme, onCopy, onProjectOpen }: {
  theme: Theme
  onTheme: (o?: { x: number; y: number }) => void
  onCopy: () => void
  onProjectOpen: (id: string) => void
}) {
  const { page, navigate } = usePage()
  const navigated = useRef(false)

  // Old one-page links (#projects, #ecobee, #before, ?tab=projects) land on
  // their new page; #takeone still opens its case study.
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const redirect = () => {
      const url = new URL(window.location.href)
      const target = legacyTarget(url)
      if (target) {
        url.pathname = target.path
        url.hash = target.hash
        url.searchParams.delete('tab')
        navigated.current = true
        window.history.replaceState(null, '', url)
        window.dispatchEvent(new Event('portfolio:navigate'))
      } else if (url.hash === '#takeone') onProjectOpen('takeone')
    }
    redirect()
    window.addEventListener('hashchange', redirect)
    return () => window.removeEventListener('hashchange', redirect)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.title = pages.find(p => p.id === page)!.title
  }, [page])
  useEffect(() => {
    const onPop = () => { navigated.current = true }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const nav = useMemo(() => ({
    page,
    navigate: (id: PageId, hash = '') => { navigated.current = true; navigate(id, hash) },
    openProject: onProjectOpen,
  }), [page, navigate, onProjectOpen])

  const go = (id: PageId) => ({
    href: pageHref(id),
    onClick: (e: MouseEvent<HTMLElement>) => { if (!isPlainClick(e)) return; e.preventDefault(); nav.navigate(id) },
  })

  const dock: DockItem[][] = [
    [
      { id: 'home', label: 'Home', icon: <IconHome size={19} />, active: page === 'home', ...go('home') },
      { id: 'work', label: 'Work', icon: <IconBriefcase size={19} />, active: page === 'work', ...go('work') },
      { id: 'projects', label: 'Projects', icon: <IconLayers size={19} />, active: page === 'projects', ...go('projects') },
      { id: 'hackathons', label: 'Hackathons', icon: <IconTrophy size={19} />, active: page === 'hackathons', ...go('hackathons') },
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

  return <SiteNavContext.Provider value={nav}>
    <PixelField />
    <div className="op-shell">
      <a href="#main" className="portfolio-skip" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <header className="op-header">
        <div className="op-header-top">
          <a className="op-name" {...go('home')}>Caesar Zhou</a>
          <div className="op-nav">
            <a href={`mailto:${profile.email}?subject=Resume%20request`} className="op-nav-link">Résumé</a>
            <ThemeToggle theme={theme} onToggle={onTheme} />
          </div>
        </div>
        <LayoutGroup id="tabs">
          <nav className="op-tabs" aria-label="Pages">
            {pages.map(p => <a key={p.id} className="op-tab" aria-current={page === p.id ? 'page' : undefined} {...go(p.id)}>
              {p.label}
              {page === p.id && <motion.span layoutId="tab-pixels" className="op-tab-pixels" aria-hidden="true" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            </a>)}
          </nav>
        </LayoutGroup>
      </header>

      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
        <PageFrame key={page} id={page} focus={navigated.current}>
          {page === 'home' && <HomePage onCopy={onCopy} first={!navigated.current} />}
          {page === 'work' && <WorkPage />}
          {page === 'projects' && <ProjectsPage />}
          {page === 'hackathons' && <HackathonsPage />}
        </PageFrame>
      </AnimatePresence>

      <footer className="op-footer">
        <a href={`mailto:${profile.email}`} className="op-footer-mail">{profile.email}</a>
        <span>Toronto &amp; Waterloo</span>
      </footer>
      <Dock groups={dock} />
    </div>
  </SiteNavContext.Provider>
}
