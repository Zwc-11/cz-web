import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { store } from '../lib/storage'

export type Theme = 'dark' | 'light'
const initial = (): Theme => {
  const saved = store.get('cz-theme')
  if (saved === 'dark' || saved === 'light') return saved
  const stamped = document.documentElement.dataset.theme
  if (stamped === 'dark' || stamped === 'light') return stamped
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial)
  const themeRef = useRef(theme)
  const transitionRef = useRef<ViewTransition | null>(null)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c0d10' : '#fbfbfc')
    store.set('cz-theme', theme)
  }, [theme])
  useEffect(() => () => transitionRef.current?.skipTransition(), [])
  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next = themeRef.current === 'light' ? 'dark' : 'light'
    themeRef.current = next
    const root = document.documentElement
    const apply = () => { root.dataset.theme = next; setTheme(next) }
    transitionRef.current?.skipTransition()
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transitionRef.current = null
      delete root.dataset.themeTransition
      apply()
      return
    }
    root.dataset.themeTransition = 'true'
    try {
      const transition = document.startViewTransition(() => flushSync(apply))
      transitionRef.current = transition
      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? window.innerHeight / 3
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      void transition.ready.then(() => {
        root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
          duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)',
        })
      }).catch(() => {})
      void transition.finished.finally(() => {
        if (transitionRef.current !== transition) return
        transitionRef.current = null
        delete root.dataset.themeTransition
      }).catch(() => {})
    } catch {
      delete root.dataset.themeTransition
      apply()
    }
  }, [])
  return { theme, toggle }
}
