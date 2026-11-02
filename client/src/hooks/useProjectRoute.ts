import { useCallback, useRef, useSyncExternalStore } from 'react'
import { works } from '../content/portfolio'
import { projectURL, homeURL } from '../lib/projectNavigation'

const subscribe = (listener: () => void) => {
  window.addEventListener('popstate', listener)
  window.addEventListener('portfolio:navigate', listener)
  return () => {
    window.removeEventListener('popstate', listener)
    window.removeEventListener('portfolio:navigate', listener)
  }
}
const snapshot = () => window.location.search
const notify = () => window.dispatchEvent(new Event('portfolio:navigate'))

export function useProjectRoute() {
  const search = useSyncExternalStore(subscribe, snapshot)
  const requested = new URLSearchParams(search).get('project')
  const project = works.find(work => work.id === requested) ?? null
  const pushed = useRef(false)
  const opener = useRef<HTMLElement | null>(null)

  const open = useCallback((id: string) => {
    if (!works.some(work => work.id === id)) return
    const currentId = new URLSearchParams(window.location.search).get('project')
    const replacing = works.some(work => work.id === currentId)
    if (!replacing) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const url = projectURL(window.location.href, id)
    window.history[replacing ? 'replaceState' : 'pushState'](null, '', url)
    if (!replacing) pushed.current = true
    notify()
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      window.history.back()
    } else {
      const url = homeURL(window.location.href)
      window.history.replaceState(null, '', url)
      notify()
    }
  }, [])

  const restoreFocus = useCallback(() => {
    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true })
  }, [])

  return { project, open, close, restoreFocus }
}
