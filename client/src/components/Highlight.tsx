import { animate, useInView, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Living gradient inside the letters, drifting back and forth (after React Bits' Gradient Text).
 * The colours follow the site's wood and fire palette, with a warm gold in between.
 */
export function GradientText({ children, speed = 7 }: { children: ReactNode; speed?: number }) {
  return <span className="fx-gradient" style={{ '--fx-speed': `${speed}s` } as CSSProperties}>{children}</span>
}

/**
 * A band of light that sweeps across the text, pausing between passes (after React Bits' Shiny Text).
 * It starts when the text scrolls into view.
 */
export function ShinyText({ children, tone = 'ink', delay = 0 }: { children: ReactNode; tone?: 'ink' | 'gold'; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  return <span ref={ref} className={`fx-shiny fx-shiny-${tone}`} data-on={inView ? 'true' : 'false'} style={{ '--fx-delay': `${delay}ms` } as CSSProperties}>{children}</span>
}

/** Number that counts up once when visible (after React Bits' Count Up). */
export function CountUp({ to, decimals = 0, prefix = '', suffix = '' }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) { if (reduce) setValue(to); return }
    const controls = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: setValue })
    return () => controls.stop()
  }, [inView, reduce, to])
  return <span ref={ref} className="hl-count" aria-label={`${prefix}${to.toFixed(decimals)}${suffix}`}>
    <span aria-hidden="true">{prefix}{value.toFixed(decimals)}{suffix}</span>
  </span>
}

// Numbers, percentages and "70+" style figures inside prose. Skips years, event numbers and model names like SO-101.
const figure = /((?<![\w-])(?<!Hacks\s)(?!(?:19|20)\d\d\b)\d[\d,]*(?:\.\d+)?\s?(?:%|\+|x)?(?:\s?(?:hours?|ms|s|clients|tools|agents)\b)?(?![A-Za-z]))/g

/** Wraps every figure in a sentence with emphasis so results stand out at a glance. */
export function Emphasize({ text }: { text: string }) {
  const parts = text.split(figure)
  return <>{parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="hl-figure">{part}</strong> : <Fragment key={i}>{part}</Fragment>)}</>
}
