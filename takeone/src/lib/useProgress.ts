import { useEffect, useState } from 'react'
import { rt } from '../store'

/** Re-renders only when the derived value changes. `fn` runs every animation frame. */
export function useDerived<T>(fn: () => T): T {
  const [v, setV] = useState<T>(fn)
  useEffect(() => {
    let raf = 0
    let last = v
    const tick = () => {
      const n = fn()
      if (n !== last) {
        last = n
        setV(n)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return v
}

/** Progress through section i, 0..1, or -1 when another section is on screen. */
export const sectionProgress = (i: number) => (rt.shot === i ? rt.f : rt.shot === i - 1 && rt.blend > 0.6 ? 0 : -1)
