import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { takeone } from '../../content/work'
import { works } from '../../content/portfolio'
import { cn } from '../../lib/cn'
import { IconArrowUpRight, IconGitHub, IconPlay } from '../icons'
import { Monitor } from '../Monitor'
import { ProjectGallery } from '../ProjectGallery'
import { LinkButton, Tag } from '../ui'
import { Stats, SubHead, TakeHead } from './parts'

const STEP_MS = 4800

function Pipeline() {
  const steps = takeone.pipeline
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!auto || !inView || reduce) return
    const t = window.setTimeout(() => setI((n) => (n + 1) % steps.length), STEP_MS)
    return () => window.clearTimeout(t)
  }, [i, auto, inView, reduce, steps.length])

  const pick = (n: number) => {
    setAuto(false)
    setI(n)
  }
  const s = steps[i]

  return (
    <div ref={ref} className="rounded-[14px] border border-line bg-surface p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="mono-label">How a shot gets made</span>
        <span className="font-mono text-[11px] text-faint">
          {String(i + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </span>
      </div>

      {/* track */}
      <div
        className="relative mt-6"
        role="tablist"
        aria-label="TakeOne pipeline"
        onKeyDown={(e) => {
          const next = e.key === 'ArrowRight' ? (i + 1) % steps.length : e.key === 'ArrowLeft' ? (i - 1 + steps.length) % steps.length : e.key === 'Home' ? 0 : e.key === 'End' ? steps.length - 1 : null
          if (next === null) return
          e.preventDefault()
          pick(next)
          e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
        }}
      >
        <div className="absolute top-[13px] right-[10%] left-[10%] h-px bg-line-2" aria-hidden />
        <motion.div
          aria-hidden
          className="absolute top-[13px] left-[10%] h-px bg-rec"
          animate={{ width: `${(i / (steps.length - 1)) * 80}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
        <div className="relative grid grid-cols-5">
          {steps.map((st, n) => {
            const on = n === i
            const done = n < i
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                id={`shot-tab-${st.id}`}
                aria-controls="shot-panel"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => pick(n)}
                className="group flex flex-col items-center gap-2 outline-none"
              >
                <span
                  className={cn(
                    'relative grid h-[27px] w-[27px] place-items-center rounded-full border font-mono text-[10.5px] transition-colors duration-300',
                    on && 'border-rec-strong bg-rec-strong text-white',
                    done && 'border-rec/60 bg-surface text-rec-ink',
                    !on && !done && 'border-line-2 bg-surface text-faint group-hover:border-faint group-hover:text-fg',
                  )}
                >
                  {n + 1}
                  {on && !reduce && (
                    <motion.span
                      layoutId="pipe-ring"
                      className="absolute -inset-[5px] rounded-full border border-rec/40"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </span>
                <span className={cn('text-[12.5px] transition-colors sm:text-[13px]', on ? 'font-medium text-fg' : 'text-muted group-hover:text-fg')}>
                  {st.step}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* detail */}
      <div className="relative mt-6 min-h-[168px] border-t border-line pt-5 sm:min-h-[132px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={s.id}
            role="tabpanel"
            id="shot-panel"
            aria-labelledby={`shot-tab-${s.id}`}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 0.28 }}
          >
            <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-fg">{s.title}</h3>
            <p className="mt-1.5 text-[14.5px] leading-[1.6]">{s.body}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.tech.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        {auto && inView && !reduce && (
          <motion.span
            key={`bar-${i}`}
            aria-hidden
            className="absolute top-0 left-0 h-px bg-faint"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </div>
  )
}
export function TakeOneTake() {
  return (
    <>
      <TakeHead
        kicker={
          <span className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-rec-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-rec" /> {takeone.award}
            </span>
          </span>
        }
        title={
          <>
            TakeOne: an AI film crew <span className="serif-accent font-normal text-[1.06em] text-muted">on wheels.</span>
          </>
        }
      >
        {takeone.summary}
      </TakeHead>

      <Monitor />
      <p className="mt-3 text-[13.5px] text-faint">An interactive viewfinder over project photographs. Move the cursor or tap to reframe; this is a portfolio interaction, not a live camera feed.</p>

      <Stats items={takeone.stats} className="mt-10" />

      <div className="mt-4">
        <Pipeline />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <LinkButton href={takeone.links.demo} external variant="primary">
          <IconPlay size={13} /> Watch the demo
        </LinkButton>
        <LinkButton href={takeone.links.github} external>
          <IconGitHub size={15} /> Source
        </LinkButton>
        <LinkButton href={takeone.links.devpost} external>
          Devpost <IconArrowUpRight size={14} />
        </LinkButton>
        <span className="text-[13px] sm:ml-auto">Built with {takeone.team.join(' and ')}</span>
      </div>

      <SubHead>Other weekend robots</SubHead>
      <ul className="border-t border-line">
        {works.filter(p => p.category === 'Robotics' && p.id !== 'takeone').map(p => <li key={p.id} className="border-b border-line py-5">
          <div className="flex items-baseline justify-between gap-4"><h4 className="text-[17px] font-medium text-fg">{p.name}</h4><span className="font-mono text-[11px] text-faint">{p.year}</span></div>
          <p className="mt-1 text-[14px]">{p.tagline}</p>
          {p.award && <p className="growth-ink mt-2 text-[12px]">{p.award}</p>}
          <div className="mt-4"><ProjectGallery id={p.id} name={p.name} wide /></div>
          <details className="project-story mt-2"><summary>Inside {p.name}</summary><div className="pb-3"><p>{p.summary}</p><p>{p.result}</p><div className="mt-3 flex flex-wrap gap-1.5">{p.tags.map(t=><Tag key={t}>{t}</Tag>)}</div><div className="mt-4 flex flex-wrap gap-4">{p.links.map(l=><a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-9 items-center gap-1 text-[13px] text-fg">{l.label}<IconArrowUpRight size={13}/></a>)}</div></div></details>
        </li>)}
      </ul>
    </>
  )
}
