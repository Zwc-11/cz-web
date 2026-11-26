import { useEffect, useRef, useState, type FormEvent } from 'react'
import { bus, pushLog, rt, setUi, useUi, type Budget } from '../store'
import { CHIPS, MAX_S, TEMPLATES, parseDirection, type TemplateId } from '../three/templates'
import { cart } from '../three/Director'
import { say } from '../lib/voice'

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms))
let takeNo = 3
let takeId = 0

const SEG = [
  { key: 'toolCall', label: 'Tool call', color: '#6f737a' },
  { key: 'compile', label: 'Compile', color: '#ef6a1a' },
  { key: 'preflight', label: 'Preflight', color: '#f1f1ed' },
  { key: 'reply', label: 'Reply', color: '#6f737a' },
] as const

async function runDirection(text: string) {
  const parsed = parseDirection(text)
  pushLog('you', text)
  if (!parsed) {
    pushLog('err', 'No move matches that on this page. Try push in, pull out, orbit, crane, tilt up, follow me or dolly zoom.')
    return
  }
  const { template, duration, requested } = parsed
  setUi({ busy: true, budget: null })
  const id = ++takeId
  rt.take = { id, template, duration, phase: 'thinking', phaseStart: rt.time }

  await wait(450)
  pushLog('call', `propose_shot(template_id="${template}", duration_s=${duration})`)
  const key = `${template}:${duration}`
  const cold = !rt.warm.has(key)
  if (cold) say('Setting that up now.')
  await wait(cold ? 2060 : 40)
  rt.warm.add(key)
  pushLog('sys', `compile_preview   ${cold ? '2.06 s, cold' : '0.04 s, cache hit'}`)
  await wait(20)
  const capped = requested != null && requested > MAX_S
  pushLog('sys', capped ? `preflight   passed at ${duration} s (this page caps a take at ${MAX_S} s)` : 'preflight   passed: joints in range, light arm outside the frame')
  const budget: Budget = { toolCall: 450, compile: cold ? 2060 : 40, cold, preflight: 20, reply: 350 }
  setUi({ budget })
  await wait(350)
  say(TEMPLATES[template].reply(duration))
  await wait(1100)
  if (!rt.take || rt.take.id !== id) return
  pushLog('sys', 'Moving to the first mark.')
  rt.take.from = { x: cart.x, z: cart.z, yaw: cart.yaw }
  rt.take.phase = 'reposition'
  rt.take.phaseStart = rt.time
}

export function Console() {
  const busy = useUi((s) => s.busy)
  const rolling = useUi((s) => s.rolling)
  const log = useUi((s) => s.log)
  const budget = useUi((s) => s.budget)
  const [text, setText] = useState('')
  const monRef = useRef<HTMLDivElement>(null)
  const [template, setTemplate] = useState<TemplateId | null>(null)

  useEffect(() => {
    rt.monitorEl = monRef.current
    const onRolling = () => {
      setUi({ rolling: true })
      pushLog('muted', 'Rolling. TakeOne stays silent until cut.')
    }
    const onCut = () => {
      setUi({ rolling: false })
      takeNo += 1
      say(`Cut. Take ${takeNo} is in the edit.`)
    }
    const onThumb = (e: Event) => {
      const { id, url } = (e as CustomEvent<{ id: number; url: string }>).detail
      const tk = rt.take
      setUi((s) => ({
        takes: [...s.takes, { id, template: tk?.template ?? 'push_in', duration: tk?.duration ?? 5, thumb: url, mine: true }],
      }))
    }
    const onDone = () => {
      setUi({ busy: false })
      setTemplate(null)
      if (rt.monitorClock) rt.monitorClock.textContent = '00:00:00:00'
    }
    bus.addEventListener('rolling', onRolling)
    bus.addEventListener('cut', onCut)
    bus.addEventListener('thumb', onThumb)
    bus.addEventListener('done', onDone)
    return () => {
      rt.monitorEl = null
      bus.removeEventListener('rolling', onRolling)
      bus.removeEventListener('cut', onCut)
      bus.removeEventListener('thumb', onThumb)
      bus.removeEventListener('done', onDone)
    }
  }, [])

  const go = (phrase: string) => {
    if (busy) return
    const p = parseDirection(phrase)
    setTemplate(p?.template ?? null)
    void runDirection(phrase)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (rolling && rt.take) {
      rt.take.phase = 'cut'
      rt.take.phaseStart = rt.time
      bus.dispatchEvent(new Event('cut'))
      return
    }
    const t = text.trim()
    if (!t) return
    setText('')
    go(t)
  }

  const total = budget ? budget.toolCall + budget.compile + budget.preflight + budget.reply : 0
  const info = template ? TEMPLATES[template] : null

  return (
    <div className="direct-grid">
      <div>
        <h2 className="display">Direct a shot.</h2>
        <p className="lede">
          Pick a move or type one in your own words. The page runs the same steps on a model of the rig, and the monitor shows what its phone camera
          sees.
        </p>
        <div className="console">
          <div className="chips" role="group" aria-label="Camera moves">
            {CHIPS.map((id) => {
              const t = TEMPLATES[id]
              return (
                <button key={id} className="chip" disabled={busy} onClick={() => go(t.phrase(t.defaultDuration))}>
                  {t.label}
                </button>
              )
            })}
          </div>
          <form className="direction" onSubmit={submit}>
            <label className="sr-only" htmlFor="direction">
              Tell TakeOne what shot you want
            </label>
            <input
              id="direction"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Try “slow orbit, 8 seconds”"
              autoComplete="off"
              disabled={busy}
            />
            <button className="roll" type="submit" data-cut={rolling} disabled={busy && !rolling}>
              {rolling ? 'Cut' : 'Roll'}
            </button>
          </form>
          <ol className="log" aria-live="polite">
            {log.length === 0 && <li className="log-empty">Your conversation with TakeOne appears here.</li>}
            {log.slice(-7).map((l) => (
              <li key={l.id} className={l.kind}>
                {l.kind === 'you' && <span className="who">You</span>}
                {l.kind === 'to' && <span className="who">TakeOne</span>}
                {l.text}
              </li>
            ))}
          </ol>
          <div className="budget">
            <div className="budget-head">
              <span>Where the turn went</span>
              <span className="num">{budget ? `${total.toLocaleString()} ms` : 'Waiting for a direction'}</span>
            </div>
            <div className="budget-bar" aria-hidden="true">
              {SEG.map((s) => (
                <span key={s.key} style={{ flexGrow: budget ? budget[s.key] : 1, background: budget ? s.color : '#26282c' }} />
              ))}
            </div>
            <div className="budget-legend num">
              {SEG.map((s) => (
                <span key={s.key}>
                  <i style={{ background: s.color }} />
                  {s.label} {budget ? `${budget[s.key].toLocaleString()} ms` : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="small" style={{ marginTop: 12, maxWidth: '34em' }}>
          Compile times replay numbers measured on the TakeOne laptop: 2.06 s cold, 0.04 s from cache. Voice hops are the design budget. A cold compile
          is why TakeOne says “setting that up now” first.
        </p>
      </div>
      <figure className="monitor">
        <div className="monitor-body">
          <div className="monitor-screen">
            <div className="monitor-view" ref={monRef} />
            <div className="thirds" />
            <div className="safe" />
            <div className="monitor-border" data-on={rolling} />
            <div className="mon-tl">
              <span className="rec" data-on={rolling}>
                {rolling ? 'REC' : 'Standby'}
              </span>
            </div>
            <div className="mon-tr num" ref={(el) => {
            rt.monitorLens = el
          }}>
              30 mm
            </div>
            <div className="mon-bl">{info ? `${info.id}` : 'Arm one, iPhone'}</div>
            <div className="mon-br num" ref={(el) => {
            rt.monitorClock = el
          }}>
              00:00:00:00
            </div>
          </div>
          <div className="monitor-foot">
            <span>Phone camera, 16:9</span>
            <span className="num">{busy ? (rolling ? 'Recording' : 'Preparing') : 'Ready'}</span>
          </div>
        </div>
        <figcaption className="small">The monitor is a second render from the phone’s position on the arm, so every move you call is the shot you’d get.</figcaption>
      </figure>
    </div>
  )
}
