import { motion, useReducedMotion } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'

/**
 * Rise and brighten once when scrolled into view. The resting state is
 * already readable, so nothing depends on the observer firing
 * (screenshots, crawlers and link previews see the whole page).
 */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0.35, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({ index, label, title, intro }: { index: string; label: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <Reveal className="mb-8">
      <div className="mono-label flex items-center gap-3">
        <span className="text-rec-ink">{index}</span>
        <span className="h-px w-6 bg-line-2" aria-hidden />
        <span>{label}</span>
      </div>
      <h2 className="mt-3 text-[28px] leading-[1.12] font-semibold tracking-[-0.025em] text-fg sm:text-[34px]">{title}</h2>
      {intro && <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed">{intro}</p>}
    </Reveal>
  )
}

type BtnProps = ComponentProps<'button'> & { variant?: 'primary' | 'ghost' | 'quiet'; size?: 'sm' | 'md' }
const btnCls = (variant: BtnProps['variant'] = 'ghost', size: BtnProps['size'] = 'md') =>
  cn(
    'group inline-flex items-center justify-center gap-2 rounded-[10px] font-medium whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]',
    size === 'md' ? 'h-10 px-4 text-[14px]' : 'h-8 px-3 text-[13px]',
    variant === 'primary' && 'bg-fg text-bg hover:bg-fg/85',
    variant === 'ghost' && 'border border-line-2 text-fg hover:border-faint hover:bg-surface-2',
    variant === 'quiet' && 'text-muted hover:text-fg hover:bg-surface-2',
  )

export function Button({ variant, size, className, ...p }: BtnProps) {
  return <button type="button" className={cn(btnCls(variant, size), className)} {...p} />
}

export function LinkButton({
  variant,
  size,
  className,
  external,
  ...p
}: ComponentProps<'a'> & { variant?: BtnProps['variant']; size?: BtnProps['size']; external?: boolean }) {
  return (
    <a
      className={cn(btnCls(variant, size), className)}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...p}
    />
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-md border border-line bg-surface-2 px-2 font-mono text-[11px] tracking-[0.01em] text-muted">
      {children}
    </span>
  )
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-2 bg-surface-2 px-1.5 font-mono text-[10.5px] leading-none text-muted',
        className,
      )}
    >
      {children}
    </kbd>
  )
}

export function OrgMark({ mark, bg, fg, size = 28 }: { mark: string; bg: string; fg: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid flex-none place-items-center rounded-[8px] font-semibold"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.46 }}
    >
      {mark}
    </span>
  )
}
