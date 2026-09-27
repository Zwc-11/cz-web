import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function TakeHead({ kicker, title, children }: { kicker: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-10">
      <div className="mono-label">{kicker}</div>
      <h2 className="mt-3 text-[34px] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-fg sm:text-[52px]">{title}</h2>
      {children && <div className="mt-4 max-w-[62ch] text-[16.5px] leading-[1.65]">{children}</div>}
    </header>
  )
}

export function Stats({ items, className }: { items: readonly { value: string; label: string }[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-4', className)}>
      {items.map((s) => (
        <div key={s.label} className="bg-bg p-4">
          <div className="text-[24px] leading-none font-semibold tracking-[-0.03em] text-fg">{s.value}</div>
          <div className="mt-2 text-[13px] leading-snug">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

export function Block({ label, children, strong }: { label: string; children: ReactNode; strong?: boolean }) {
  return (
    <div>
      <div className={cn('mono-label', strong && 'text-rec-ink')}>{label}</div>
      <p className={cn('mt-1.5 text-[15px] leading-[1.65]', strong && 'text-fg')}>{children}</p>
    </div>
  )
}

export function SubHead({ children }: { children: ReactNode }) {
  return <h3 className="mt-14 mb-4 text-[20px] font-semibold tracking-[-0.02em] text-fg">{children}</h3>
}
