import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/** Fixed WebGL backdrop. three.js loads after first paint and is skipped without WebGL. */
export function AmbientBackground() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduce = !!useReducedMotion()
  useEffect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    const probe = document.createElement('canvas')
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return
    import('../lib/ambientField').then(({ startAmbientField }) => {
      if (cancelled || !canvas.current) return
      try {
        stop = startAmbientField(canvas.current, reduce)
        canvas.current.dataset.ready = 'true'
      } catch { /* the page works without the backdrop */ }
    })
    return () => { cancelled = true; stop?.() }
  }, [reduce])
  return <canvas ref={canvas} className="ambient-canvas" aria-hidden="true" />
}
