/** The site's pages. Each one is a real path (with the trailing slash static hosts redirect to), so it can be linked, reloaded and shared. */
export type PageId = 'home' | 'work' | 'projects' | 'hackathons'

export type Page = { id: PageId; path: string; label: string; title: string }

export const pages: Page[] = [
  { id: 'home', path: '/', label: 'Home', title: 'Caesar Zhou' },
  { id: 'work', path: '/work/', label: 'Work', title: 'Work · Caesar Zhou' },
  { id: 'projects', path: '/projects/', label: 'Projects', title: 'Projects · Caesar Zhou' },
  { id: 'hackathons', path: '/hackathons/', label: 'Hackathons', title: 'Hackathons · Caesar Zhou' },
]

/** '/work', '/work/' and '/work/index.html' are all Work; anything unknown is Home. */
export function pageFromPath(pathname: string): Page {
  const clean = pathname.replace(/index\.html$/, '').replace(/\/+$/, '') + '/'
  return pages.find(page => page.path === clean) ?? pages[0]
}

/**
 * The single-file preview opens from disk (file://), where the History API
 * cannot change the path; there the page rides in ?page= instead.
 */
const fromDisk = () => typeof window !== 'undefined' && window.location.protocol === 'file:'

/** The page the browser is on now. */
export function currentPage(): PageId {
  if (fromDisk()) return pages.find(p => p.id === new URLSearchParams(window.location.search).get('page'))?.id ?? 'home'
  return pageFromPath(window.location.pathname).id
}

/** The link to a page, optionally to an anchor on it. */
export function pageHref(id: PageId, hash = '') {
  const anchor = hash ? `#${hash}` : ''
  if (fromDisk()) return `${window.location.pathname}${id === 'home' ? '' : `?page=${id}`}${anchor}`
  return pages.find(p => p.id === id)!.path + anchor
}

/**
 * Where an old one-page link should go now: #projects and ?tab=projects open
 * Projects, #ecobee the ecobee role, #before Education. Returns null when the
 * URL needs no change.
 */
export function legacyTarget(url: URL): { path: string; hash: string } | null {
  if (pageFromPath(url.pathname).id !== 'home') return null
  const hash = url.hash.replace(/^#\/?/, '')
  if (hash === 'projects' || (url.searchParams.get('tab') === 'projects' && !url.searchParams.get('project'))) return { path: '/projects/', hash: '' }
  if (hash === 'experience' || hash === 'ecobee') return { path: '/work/', hash: hash === 'ecobee' ? 'experience-ecobee' : '' }
  if (hash === 'before' || hash === 'education') return { path: '/work/', hash: 'education' }
  if (hash === 'hackathons') return { path: '/hackathons/', hash: '' }
  return null
}
