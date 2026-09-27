import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { takes, type TakeId } from '../content/takes'
import { IconArrowRight, IconClose } from './icons'
import type { Origin } from './Home'
import { BeforeTake } from './takes/BeforeTake'
import { EcobeeTake } from './takes/EcobeeTake'
import { ProjectsTake } from './takes/ProjectsTake'
import { TakeOneTake } from './takes/TakeOneTake'

const BODY: Record<TakeId, () => React.ReactElement> = {
  ecobee: EcobeeTake,
  before: BeforeTake,
  takeone: TakeOneTake,
  projects: ProjectsTake,
}

const inset = (o: Origin) =>
  `inset(${Math.max(0, o.top)}px ${Math.max(0, window.innerWidth - o.left - o.width)}px ${Math.max(0, window.innerHeight - o.top - o.height)}px ${Math.max(0, o.left)}px round 10px)`
const FULL = 'inset(0px 0px 0px 0px round 0px)'

/**
 * A take opens by zooming out of the phrase that was clicked: the panel
 * starts clipped to the phrase's box and grows to fill the screen.
 */
export function Take({
  id,
  origin,
  onClose,
  onGo,
  onRestoreFocus,
}: {
  id: TakeId | null
  origin?: Origin
  onClose: () => void
  onGo: (id: TakeId) => void
  onRestoreFocus: () => void
}) {
  const reduce = useReducedMotion()
  const scroller = useRef<HTMLDivElement>(null)
  const idx = id ? takes.findIndex((t) => t.id === id) : -1
  const take = idx >= 0 ? takes[idx] : null
  const prev = idx > 0 ? takes[idx - 1] : null
  const next = idx >= 0 && idx < takes.length - 1 ? takes[idx + 1] : null
  const Body = id ? BODY[id] : null

  // new take → back to top
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [id])

  // ← / → between takes (unless a widget inside has focus and uses arrows itself)
  useEffect(() => {
    if (!id) return
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[data-project-gallery]')) return
      const t = e.target as HTMLElement | null
      if (t?.closest('[role="tablist"],[role="img"],input,textarea')) return
      if (e.key === 'ArrowRight' && next) onGo(next.id)
      if (e.key === 'ArrowLeft' && prev) onGo(prev.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [id, next, prev, onGo])

  const from = origin && !reduce ? { clipPath: inset(origin) } : { opacity: 0, scale: 0.985 }
  const to = origin && !reduce ? { clipPath: FULL } : { opacity: 1, scale: 1 }

  return (
    <Dialog.Root open={!!id} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {take && Body && (
          <Dialog.Portal forceMount>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onPointerDownOutside={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => { e.preventDefault(); onRestoreFocus() }}
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                scroller.current?.focus()
              }}
            >
              <motion.div
                ref={scroller}
                tabIndex={-1}
                className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-bg outline-none"
                initial={from}
                animate={to}
                exit={from}
                transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
              >
                <div className="sticky top-0 z-10 border-b border-line bg-bg/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
                  <div className="mx-auto flex h-14 max-w-[880px] items-center justify-between px-5 sm:px-8">
                    <Dialog.Title className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.08em] text-muted uppercase">
                      <span className="rec-dot" />
                      <span className="text-rec-ink">Take {take.n}</span>
                      <span className="text-faint">/ 0{takes.length}</span>
                      <span className="hidden text-fg sm:inline">· {take.label}</span>
                    </Dialog.Title>
                    <Dialog.Close className="flex h-9 items-center gap-2 rounded-full border border-line-2 pr-2 pl-3.5 text-[13px] text-fg transition-colors hover:bg-surface-2">
                      Back <span className="hidden font-mono text-[10.5px] text-faint sm:inline">esc</span>
                      <IconClose size={15} />
                    </Dialog.Close>
                  </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={take.id}
                    className="mx-auto max-w-[880px] px-5 pt-10 pb-8 sm:px-8 sm:pt-14"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: origin ? 0.18 : 0, ease: [0.2, 0.7, 0.2, 1] } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  >
                    <Body />
                  </motion.div>
                </AnimatePresence>

                <nav aria-label="Other takes" className="mx-auto grid max-w-[880px] grid-cols-2 gap-3 px-5 pt-6 pb-[max(40px,env(safe-area-inset-bottom))] sm:px-8">
                  {prev ? (
                    <button type="button" onClick={() => onGo(prev.id)} className="group rounded-[14px] border border-line p-4 text-left transition-colors hover:border-line-2 hover:bg-surface">
                      <span className="mono-label">← Take {prev.n}</span>
                      <span className="mt-1 block text-[15px] font-medium text-fg">{prev.label}</span>
                    </button>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <button type="button" onClick={() => onGo(next.id)} className="group rounded-[14px] border border-line p-4 text-right transition-colors hover:border-line-2 hover:bg-surface">
                      <span className="mono-label">Take {next.n} →</span>
                      <span className="mt-1 flex items-center justify-end gap-2 text-[15px] font-medium text-fg">
                        {next.label}
                        <IconArrowRight size={14} className="text-rec-ink transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  ) : (
                    <Dialog.Close className="rounded-[14px] border border-line p-4 text-right transition-colors hover:border-line-2 hover:bg-surface">
                      <span className="mono-label">That's a wrap</span>
                      <span className="mt-1 block text-[15px] font-medium text-fg">Back to the start</span>
                    </Dialog.Close>
                  )}
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
