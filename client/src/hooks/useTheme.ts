import { useCallback, useEffect, useState } from 'react'
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
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#191c19' : '#faf8f4')
    store.set('cz-theme', theme)
  }, [theme])
  // Keep navigation responsive during theme changes.
  const toggle = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), [])
  return { theme, toggle }
}
