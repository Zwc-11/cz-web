import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { takeone } from '../content/work'
import { useTimecode } from '../hooks/useTimecode'
import { cn } from '../lib/cn'

const DWELL = 5200 // ms per camera before auto-switching

/**
 * The TakeOne rig as a live camera monitor. A tracking box follows the
 * pointer the way TakeOne's MediaPipe + PID loop follows a performer,
 * then settles back on the subject when the pointer leaves.
 */
export function Monitor() {
  const cams = takeone.cams
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [auto, setAuto] = useState(true)
  const [tracking, setTracking] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const tc = useTimecode('elapsed')
  const cam = cams[i]

  // normalized pointer position → spring
  const tx = useMotionValue<number>(cam.subject.x)
  const ty = useMotionValue<number>(cam.subject.y)
  const sx = useSpring(tx, { stiffness: 160, damping: 20, mass: 0.6 })
  const sy = useSpring(ty, { stiffness: 160, damping: 20, mass: 0.6 })
  const left = useTransform(sx, (v) => `${v * 100}%`)
  const topPos = useTransform(sy, (v) => `${v * 100}%`)
  const [readout, setReadout] = useState<{ x: number; y: number }>({ x: cam.subject.x, y: cam.subject.y })

  useEffect(() => {
    const u1 = sx.on('change', (x) => setReadout((r) => ({ ...r, x })))
    const u2 = sy.on('change', (y) => setReadout((r) => ({ ...r, y })))
    return () => {
      u1()
      u2()
    }
  }, [sx, sy])

  // re-lock on the subject whenever the camera changes (unless tracking)
  useEffect(() => {
    if (!tracking) {
      tx.set(cam.subject.x)
      ty.set(cam.subject.y)
    }
  }, [cam, tracking, tx, ty])

  // auto-advance
  const [progressKey, setProgressKey] = useState(0)
  useEffect(() => {
    if (!auto || paused || reduce) return
    const t = window.setTimeout(() => setI((n) => (n + 1) % cams.length), DWELL)
    return () => window.clearTimeout(t)
  }, [i, auto, paused, reduce, cams.length, progressKey])

  const go = useCallback(
    (n: number) => {
      setI(((n % cams.length) + cams.length) % cams.length)
      setProgressKey((k) => k + 1)
    },
    [cams.length],
  )

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return
    const r = frame.current!.getBoundingClientRect()
    const x = Math.min(0.94, Math.max(0.06, (e.clientX - r.left) / r.width))
    const y = Math.min(0.9, Math.max(0.1, (e.clientY - r.top) / r.height))
    tx.set(x)
    ty.set(y)
    if (!tracking) setTracking(true)
  }
  const onLeave = () => {
    setTracking(false)
    tx.set(cam.subject.x)
    ty.set(cam.subject.y)
  }
  // touch: tap to re-target
  const onTap = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return
    const r = frame.current!.getBoundingClientRect()
    tx.set((e.clientX - r.left) / r.width)
    ty.set((e.clientY - r.top) / r.height)
  }

  return (
    <figure
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={frame}
        role="img"
        aria-label={`TakeOne camera ${cam.id}: ${cam.label}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(i + 1)
          if (e.key === 'ArrowLeft') go(i - 1)
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerDown={onTap}
        className="relative aspect-[4/3] cursor-crosshair overflow-hidden rounded-[14px] border border-line bg-black select-none sm:aspect-[16/10]"
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={cam.id}
            src={cam.src}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: cam.focus }}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.5 }, scale: { duration: DWELL / 1000 + 0.6, ease: 'linear' } }}
          />
        </AnimatePresence>

        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="thirds pointer-events-none absolute inset-0 opacity-70" />

        {/* frame corners */}
        {['left-5 top-10 border-l border-t', 'right-5 top-10 border-r border-t', 'left-5 bottom-10 border-l border-b', 'right-5 bottom-10 border-r border-b'].map((c) => (
          <span key={c} className={cn('pointer-events-none absolute h-5 w-5 border-white/85 sm:h-6 sm:w-6', c)} />
        ))}

        {/* tracking box */}
        <motion.div className="pointer-events-none absolute" style={{ left, top: topPos }}>
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: tracking || reduce ? 1 : [1, 1.06, 1] }}
              transition={tracking ? { duration: 0.2 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative h-[74px] w-[74px] sm:h-[96px] sm:w-[96px]"
            >
              {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'].map((c) => (
                <span key={c} className={cn('absolute h-3.5 w-3.5', tracking ? 'border-rec' : 'border-[#ffd166]', c)} />
              ))}
              <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
            </motion.div>
            <span
              className={cn(
                'absolute -top-6 left-0 whitespace-nowrap rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.06em] text-white',
                tracking ? 'bg-rec-strong' : 'bg-black/60',
              )}
            >
              {tracking ? 'TRACKING' : 'LOCKED'} {readout.x.toFixed(2)},{readout.y.toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3 font-mono text-[10.5px] tracking-[0.08em] text-white/90 sm:text-[11px]">
          <span className="flex items-center gap-2">
            <span className="rec-dot" />
            VIEW {tc}
          </span>
          <span>PHOTO {cam.id} · {cam.label.toUpperCase()}</span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-3 font-mono text-[10.5px] tracking-[0.08em] text-white/80 sm:text-[11px]">
          <span>TAKEONE / HTN 2026</span>
          <span className="hidden pointer-fine:inline">{tracking ? 'FOLLOW MODE' : 'MOVE CURSOR TO DIRECT'}</span>
          <span className="pointer-fine:hidden">TAP TO RE-FRAME</span>
        </div>
      </div>

      {/* camera switcher */}
      <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Project photographs">
        {cams.map((c, n) => {
          const on = n === i
          return (
            <button
              key={c.id}
              aria-pressed={on}
              onClick={() => go(n)}
              className={cn(
                'group relative overflow-hidden rounded-[8px] border px-2.5 py-2 text-left transition-colors',
                on ? 'border-line-2 bg-surface-2' : 'border-line hover:border-line-2 hover:bg-surface',
              )}
            >
              <span className={cn('block font-mono text-[10px] tracking-[0.08em] sm:inline sm:text-[10.5px]', on ? 'text-rec-ink' : 'text-faint')}>
                CAM {c.id}
              </span>
              <span className={cn('block text-[12.5px] sm:ml-1.5 sm:inline', on ? 'text-fg' : 'text-muted')}>{c.label}</span>
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-line" />
              {on && (
                <motion.span
                  key={`${progressKey}-${i}-${paused}`}
                  className="absolute bottom-0 left-0 h-[2px] bg-rec"
                  initial={{ width: paused || reduce ? '100%' : '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: paused || reduce ? 0 : DWELL / 1000, ease: 'linear' }}
                />
              )}
            </button>
          )
        })}
      </div>
      {!reduce && <button type="button" className="mt-2 min-h-9 text-[12px] text-muted hover:text-fg" onClick={() => setAuto(v => !v)}>{auto ? 'Pause slideshow' : 'Play slideshow'}</button>}
    </figure>
  )
}
