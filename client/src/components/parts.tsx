import { createContext, useContext, type MouseEvent, type ReactNode } from 'react'
import type { Cover } from '../content/onepage'
import { asset } from '../lib/asset'
import { pageHref, type PageId } from '../lib/pages'
import { LoopVideo } from './LoopVideo'

type SiteNav = {
  page: PageId
  navigate: (id: PageId, hash?: string) => void
  openProject: (id: string) => void
}
export const SiteNavContext = createContext<SiteNav | null>(null)
export const useSiteNav = () => useContext(SiteNavContext)!

/** Plain left clicks stay in the app; modified clicks keep their browser behavior. */
export const isPlainClick = (e: MouseEvent<HTMLElement>) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

/** Props for a link that opens a case study over the current page. */
export function useCaseLink() {
  const { page, openProject } = useSiteNav()
  const here = pageHref(page)
  return (id: string) => ({
    href: `${here}${here.includes('?') ? '&' : '?'}project=${id}`,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainClick(e)) return
      e.preventDefault()
      openProject(id)
    },
  })
}

/** Props for a link to another page (optionally to an anchor on it). */
export function usePageLink() {
  const { navigate } = useSiteNav()
  return (id: PageId, hash = '') => ({
    href: pageHref(id, hash),
    onClick: (e: MouseEvent<HTMLElement>) => {
      if (!isPlainClick(e)) return
      e.preventDefault()
      navigate(id, hash)
    },
  })
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <header className="op-page-head"><h1 className="op-h1">{children}</h1></header>
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-title`} className="op-section">
    <h2 id={`${id}-title`} className="op-h2">{title}</h2>
    {children}
  </section>
}

export function Logo({ src, mark }: { src?: string; mark?: { text: string; bg: string; fg: string } }) {
  if (src) return <span className="op-logo"><img src={asset(src)} alt="" width={36} height={36} loading="lazy" /></span>
  if (mark) return <span className="op-logo op-logo-mark" aria-hidden="true" style={{ background: mark.bg, color: mark.fg }}>{mark.text}</span>
  return <span className="op-logo op-logo-empty" aria-hidden="true" />
}

export function CoverArt({ cover, name }: { cover: Cover; name: string }) {
  if (cover.kind === 'video') return <div className="op-cover op-cover-video"><LoopVideo src={cover.src} webm={cover.webm} poster={cover.poster} label={`${name} demo clip`} /></div>
  if (cover.kind === 'photo') return <div className="op-cover"><img src={asset(cover.src)} alt="" loading="lazy" style={{ objectPosition: cover.position }} /></div>
  return <div className="op-cover op-cover-framed" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${cover.to} 0%, ${cover.from} 70%)` }}>
    <img src={asset(cover.src)} alt="" loading="lazy" style={{ objectPosition: cover.position ?? '0% 0%' }} />
  </div>
}
