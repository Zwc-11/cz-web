import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Theme } from '../hooks/useTheme'
import { cn } from '../lib/cn'
import { IconMoon, IconSun } from './icons'

export function ThemeToggle({
  theme,
  onToggle,
  className,
}: {
  theme: Theme
  onToggle: (origin?: { x: number; y: number }) => void
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        onToggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      className={cn('grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: reduce ? 0 : -90, opacity: reduce ? 1 : 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: reduce ? 0 : 90, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
