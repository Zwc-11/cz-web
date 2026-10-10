import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import type { Theme } from '../hooks/useTheme'

/**
 * A floating, magnifying dock. Icons swell as the pointer passes, with a
 * spring so the motion settles instead of snapping. Touch and reduced
 * motion get a steady dock with the same controls.
 */
export type DockItem = {
  id: string
  label: string
  icon: ReactNode
  href?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  active?: boolean
  pressed?: boolean
}

const BASE = 40
const PEAK = 62
const RANGE = 130

function DockIcon({ item, mouseX }: { item: DockItem; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLElement>(null)
  const [hover, setHover] = useState(false)
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect()
    return r ? x - (r.left + r.width / 2) : Infinity
  })
  const target = useTransform(distance, [-RANGE, 0, RANGE], [BASE, PEAK, BASE], { clamp: true })
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 })
  const iconScale = useTransform(size, [BASE, PEAK], [1, 1.32])

  const common = {
    ref: ref as never,
    'aria-label': item.label,
    className: 'dock-item',
    style: { width: size, height: size },
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    whileTap: { scale: 0.88 },
    'data-active': item.active || undefined,
  }
  const inner = (
    <>
      <AnimatePresence>
        {hover && (
          <motion.span
            className="dock-tooltip"
            role="presentation"
            initial={{ opacity: 0, y: 6, x: '-50%', scale: 0.92 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 4, x: '-50%', scale: 0.96, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span className="dock-glyph" style={{ scale: iconScale }}>{item.icon}</motion.span>
      <AnimatePresence>
        {item.active && (
          <motion.span
            layoutId="dock-active"
            className="dock-dot"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </>
  )

  if (item.href) {
    const external = /^https?:/.test(item.href)
    return (
      <motion.a {...common} href={item.href} onClick={item.onClick} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}>
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button {...common} type="button" onClick={item.onClick} aria-pressed={item.pressed}>
      {inner}
    </motion.button>
  )
}

export function Dock({ groups }: { groups: DockItem[][] }) {
  const reduce = useReducedMotion()
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.nav
      aria-label="Quick navigation"
      className="dock-wrap"
      initial={reduce ? false : { y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.55 }}
    >
      <div
        className="dock"
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== 'mouse') return
          mouseX.set(e.clientX)
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
      >
        {groups.map((group, gi) => (
          <div key={gi} className="dock-group">
            {gi > 0 && <span className="dock-divider" aria-hidden="true" />}
            {group.map((item) => <DockIcon key={item.id} item={item} mouseX={mouseX} />)}
          </div>
        ))}
      </div>
    </motion.nav>
  )
}

export function ThemeGlyph({ theme }: { theme: Theme }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.svg
        key={theme}
        width={19}
        height={19}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      >
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        )}
      </motion.svg>
    </AnimatePresence>
  )
}
