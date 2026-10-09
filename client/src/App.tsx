import { AnimatePresence, motion } from 'motion/react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Home, type Origin } from './components/Home'
import { IconCheck } from './components/icons'
import { useProjectRoute } from './hooks/useProjectRoute'
import { RouteBoundary, RouteLoading } from './components/RouteBoundary'
import { profile } from './content/profile'
import { isTakeId, type TakeId } from './content/takes'
import { useTheme } from './hooks/useTheme'

const Take = lazy(() => import('./components/Take').then(module => ({default: module.Take})))
const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy'))

const fromHash = (): TakeId | null => {
  const h = window.location.hash.replace(/^#\/?/, '')
  return isTakeId(h) ? h : null
}

export default function App() {
  const { theme, toggle } = useTheme()
  const projectRoute = useProjectRoute()
  const [take, setTake] = useState<TakeId | null>(fromHash)
  const [origin, setOrigin] = useState<Origin | undefined>()
  const pushed = useRef(false)
  const opener = useRef<HTMLElement | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef(0)

  // back / forward buttons and deep links (#takeone, #ecobee, …)
  useEffect(() => {
    const onPop = () => {
      const id = fromHash()
      if (!id) pushed.current = false
      setTake(id)
    }
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  const open = useCallback((id: TakeId, o?: Origin) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setOrigin(o)
    setTake(id)
    try {
      history.pushState(null, '', `#${id}`)
      pushed.current = true
    } catch {
      /* sandboxed frames can refuse history writes */
    }
  }, [])

  const go = useCallback((id: TakeId) => {
    setTake(id)
    try {
      history.replaceState(null, '', `#${id}`)
    } catch {
      /* ignore */
    }
  }, [])

  const close = useCallback(() => {
    try {
      if (pushed.current) {
        pushed.current = false
        // Let popstate close the panel so a second open cannot race a pending back().
        history.back()
      } else {
        setTake(null)
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    } catch {
      setTake(null)
    }
  }, [])

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
      <Home theme={theme} onTheme={toggle} onOpen={open} onCopy={copyEmail} onProjectOpen={projectRoute.open} />
      <RouteBoundary key={projectRoute.project?.id ?? take ?? 'home'} onClose={projectRoute.project ? projectRoute.close : close}>
      <Suspense fallback={<RouteLoading onClose={projectRoute.project ? projectRoute.close : close} />}>
        {projectRoute.project && <ProjectCaseStudy project={projectRoute.project} onClose={projectRoute.close} onGo={projectRoute.open} onRestoreFocus={projectRoute.restoreFocus} />}
        {take && !projectRoute.project && <Take id={take} origin={origin} onClose={close} onGo={go} onRestoreFocus={() => opener.current?.focus()} />}
      </Suspense>
      </RouteBoundary>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(24px+env(safe-area-inset-bottom,0px))] z-[65] flex justify-center">
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
