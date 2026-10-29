import { AnimatePresence, motion } from 'motion/react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Home } from './components/Home'
import { IconCheck } from './components/icons'
import { useProjectRoute } from './hooks/useProjectRoute'
import { RouteBoundary, RouteLoading } from './components/RouteBoundary'
import { profile } from './content/profile'
import { useTheme } from './hooks/useTheme'

const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy'))

export default function App() {
  const { theme, toggle } = useTheme()
  const projectRoute = useProjectRoute()
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef(0)

  const say = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      say('Email copied')
    } catch {
      say(profile.email)
    }
  }, [say])

  // T toggles the theme anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest('input,textarea')) return
      if (e.key.toLowerCase() === 't') toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return (
    <>
      <Home theme={theme} onTheme={toggle} onCopy={copyEmail} onProjectOpen={projectRoute.open} />
      {projectRoute.project && <RouteBoundary key={projectRoute.project.id} onClose={projectRoute.close}>
      <Suspense fallback={<RouteLoading onClose={projectRoute.close} />}>
        <ProjectCaseStudy project={projectRoute.project} onClose={projectRoute.close} onGo={projectRoute.open} onRestoreFocus={projectRoute.restoreFocus} />
      </Suspense>
      </RouteBoundary>}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom,0px))] z-[65] flex justify-center">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-[13.5px] font-medium text-bg shadow-[var(--shadow)] select-text"
            >
              <IconCheck size={15} /> {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
