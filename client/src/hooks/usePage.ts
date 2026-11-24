import { useCallback, useSyncExternalStore } from 'react'
import { currentPage, pageHref, type PageId } from '../lib/pages'

const subscribe = (listener: () => void) => {
  window.addEventListener('popstate', listener)
  window.addEventListener('portfolio:navigate', listener)
  return () => {
    window.removeEventListener('popstate', listener)
    window.removeEventListener('portfolio:navigate', listener)
  }
}
const snapshot = () => currentPage()

/** Client-side page switching on top of the History API. */
export function usePage() {
  const page = useSyncExternalStore(subscribe, snapshot)

  const navigate = useCallback((id: PageId, hash = '') => {
    const url = new URL(pageHref(id, hash), window.location.href)
    if (url.href === window.location.href) {
      if (hash) document.getElementById(hash)?.scrollIntoView({ block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.history.pushState({ page: id }, '', url)
    window.dispatchEvent(new Event('portfolio:navigate'))
  }, [])

  return { page, navigate }
}
