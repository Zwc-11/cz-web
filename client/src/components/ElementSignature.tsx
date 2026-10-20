import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { store } from '../lib/storage'

/** Wood / fire are a personal visual reference, not a prediction about outcomes. */
export function ElementSignature() {
  const [open, setOpen] = useState(false)
  const [warmth, setWarmth] = useState(() => {
    const saved = store.get('cz-element-warmth')
    const value = saved === null ? 75 : Number(saved)
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 75
  })
  const [tilt, setTilt] = useState(0)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    document.documentElement.style.setProperty('--element-warmth', `${warmth}%`)
    store.set('cz-element-warmth', String(warmth))
  }, [warmth])
  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape) }
  }, [open])

  return <div className="element-signature" ref={container}>
    <button ref={trigger} type="button" className="element-seal" aria-label="Explore the wood and fire palette" aria-expanded={open} aria-controls={open ? 'element-palette' : undefined}
      onClick={() => setOpen(!open)} onPointerMove={event => {
        if (reduce || event.pointerType === 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        setTilt(((event.clientX - rect.left) / rect.width - .5) * 14)
      }} onPointerLeave={() => setTilt(0)} style={{ '--seal-tilt': `${tilt}deg` } as CSSProperties}>
      <svg viewBox="0 0 120 108" fill="none" aria-hidden="true">
        <circle cx="60" cy="52" r="39" stroke="var(--line-2)" strokeWidth=".7" />
        <path d="M24 66A39 39 0 0 1 93 30" stroke="var(--fire)" strokeWidth="1.5" />
        <path d="M35 83Q55 66 61 31M50 65Q36 61 36 46Q54 44 55 59M57 50Q73 49 80 34Q63 32 59 44M44 73Q30 77 27 65Q39 58 48 65" stroke="var(--wood)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M61 31Q54 42 57 51" stroke="var(--wood)" strokeWidth="1" />
        <g className="element-sun" style={{ transform: `translate(${(warmth - 50) * .14}px, ${(50 - warmth) * .06}px)` }}>
          <circle cx="87" cy="26" r="10" fill="var(--fire)" fillOpacity=".12" />
          <circle cx="87" cy="26" r="4" fill="var(--fire)" />
        </g>
        <text x="47" y="104" textAnchor="middle" fill="var(--wood)" fontSize="11">木</text>
        <text x="60" y="103" textAnchor="middle" fill="var(--faint)" fontSize="9">·</text>
        <text x="73" y="104" textAnchor="middle" fill="var(--fire)" fontSize="11">火</text>
      </svg>
      <span>Wood & fire <span aria-hidden="true">{open ? '−' : '+'}</span></span>
    </button>
    <AnimatePresence>
    {open && <motion.div id="element-palette" className="element-palette" role="group" aria-labelledby="element-palette-title"
      initial={reduce ? false : { opacity: 0, y: -6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: .98 }}
      transition={{ duration: .22, ease: [0.22, 0.8, 0.2, 1] }}>
      <div className="element-palette-head">
        <div>
          <p className="element-palette-kicker">木 · 火 · Wood &amp; fire</p>
          <h2 id="element-palette-title" className="font-serif text-[26px] leading-[1.1] text-fg">Growth &amp; warmth</h2>
        </div>
        <button type="button" onClick={() => { setOpen(false); trigger.current?.focus() }} aria-label="Close palette" className="element-close">×</button>
      </div>
      <p className="element-palette-text">A small nod to my Chinese heritage and 八字: wood in the leaves, fire in the sunlight. Slide to retint the accents across the site.</p>
      <div className="element-balance">
        <label htmlFor="element-warmth" className="text-[12px] font-medium text-fg">Find your balance</label>
        <span className="element-readout" aria-hidden="true">{100 - warmth}% wood · {warmth}% fire</span>
      </div>
      <input id="element-warmth" className="element-range" type="range" min="0" max="100" step="5" value={warmth} onChange={event => setWarmth(Number(event.target.value))}
        aria-valuetext={`${warmth}% fire, ${100 - warmth}% wood`} />
      <div className="element-palette-foot">
        <span className="growth-ink">木 Wood</span>
        <button type="button" className="element-reset" onClick={() => setWarmth(75)} disabled={warmth === 75}>Reset</button>
        <span style={{ color: 'var(--fire)' }}>火 Fire</span>
      </div>
    </motion.div>}
    </AnimatePresence>
  </div>
}
