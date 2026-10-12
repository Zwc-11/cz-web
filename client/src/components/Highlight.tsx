import { animate, useInView, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Highlighter stroke that draws in behind the text the first time it scrolls into view.
 * `shine` adds a slow light sweep across the letters (inspired by React Bits' Shiny Text).
 */
export function Marker({ children, shine = false, tone = 'accent', delay = 0 }: { children: ReactNode; shine?: boolean; tone?: 'accent' | 'gold'; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  return <span ref={ref} className={`hl-marker hl-${tone}`} data-on={inView || reduce ? 'true' : 'false'} style={{ transitionDelay: `${delay}ms` }}>
    {shine ? <span className="hl-shine">{children}</span> : children}
  </span>
}

/** Number that counts up once when visible (inspired by React Bits' Count Up). */
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

// Numbers, percentages and "70+" style figures inside prose. Skips years and model names like SO-101.
const figure = /((?<![\w-])(?<!Hacks\s)(?!(?:19|20)\d\d\b)\d[\d,]*(?:\.\d+)?\s?(?:%|\+|x)?(?:\s?(?:hours?|ms|s|clients|tools|agents)\b)?(?![A-Za-z]))/g

/** Wraps every figure in a sentence with emphasis so results stand out at a glance. */
export function Emphasize({ text }: { text: string }) {
  const parts = text.split(figure)
  return <>{parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="hl-figure">{part}</strong> : <Fragment key={i}>{part}</Fragment>)}</>
}
