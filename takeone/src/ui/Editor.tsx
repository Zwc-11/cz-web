import { useEffect, useMemo, useRef, useState } from 'react'
import { useUi, type Take } from '../store'

// A tiny version of TakeOne's editor model: the operation log is the only thing
// you can write; the timeline is folded from it. Undo moves the cursor back.

type Op =
  | { kind: 'add'; take: Take }
  | { kind: 'trim'; take: Take; inS: number; outS: number }
  | { kind: 'xfade'; after: number; dur: number }
  | { kind: 'look'; name: string }

interface Clip {
  take: Take
  inS: number
  outS: number
}
interface Timeline {
  clips: Clip[]
  xfades: Set<number>
  look: string | null
}

function opsFor(takes: Take[]): Op[] {
  const ops: Op[] = []
  takes.forEach((t, i) => {
    ops.push({ kind: 'add', take: t })
    ops.push({ kind: 'trim', take: t, inS: 0.4, outS: Math.max(1.6, t.duration - 0.3) })
    if (i > 0) ops.push({ kind: 'xfade', after: i - 1, dur: 0.5 })
    if (i === 1) ops.push({ kind: 'look', name: 'tungsten' })
  })
  return ops
}

function fold(ops: Op[]): Timeline {
  const tl: Timeline = { clips: [], xfades: new Set(), look: null }
  for (const op of ops) {
    if (op.kind === 'add') tl.clips.push({ take: op.take, inS: 0, outS: op.take.duration })
    else if (op.kind === 'trim') {
      const c = tl.clips.find((c) => c.take.id === op.take.id)
      if (c) {
        c.inS = op.inS
        c.outS = op.outS
      }
    } else if (op.kind === 'xfade') tl.xfades.add(op.after)
    else tl.look = op.name
  }
  return tl
}

const label = (_t: Take, i: number) => `Take ${i + 1}`
function opText(op: Op, takes: Take[]) {
  const n = (t: Take) => takes.findIndex((x) => x.id === t.id) + 1
  switch (op.kind) {
    case 'add':
      return `add_clip take_${n(op.take)}  ${op.take.template}`
    case 'trim':
      return `trim take_${n(op.take)}  ${op.inS.toFixed(1)}–${op.outS.toFixed(1)} s`
    case 'xfade':
      return `transition crossfade  ${op.dur.toFixed(1)} s`
    case 'look':
      return `grade look "${op.name}"`
  }
}

const LOOKS: Record<string, string> = { tungsten: 'sepia(0.28) saturate(1.15) contrast(1.06) brightness(1.02)' }

export function Editor() {
  const takes = useUi((s) => s.takes)
  const ops = useMemo(() => opsFor(takes), [takes])
  const [cursor, setCursor] = useState(ops.length)
  const prevLen = useRef(ops.length)
  useEffect(() => {
    // new takes land at the end of the log; follow them if we were at the end
    const prev = prevLen.current
    const len = ops.length
    setCursor((c) => (c >= prev ? len : c))
    prevLen.current = len
  }, [ops.length])

  const tl = useMemo(() => fold(ops.slice(0, cursor)), [ops, cursor])
  const lens = tl.clips.map((c) => Math.max(0.2, c.outS - c.inS))
  const total = lens.reduce((a, b) => a + b, 0)
  const [play, setPlay] = useState<number | null>(null)
  const raf = useRef(0)

  const startPlay = () => {
    if (!total) return
    const t0 = performance.now()
    const run = () => {
      const t = ((performance.now() - t0) / 1000) * 1.6
      if (t >= total) {
        setPlay(null)
        return
      }
      setPlay(t)
      raf.current = requestAnimationFrame(run)
    }
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(run)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  // which clip is under the playhead
  let at = 0
  let idx = 0
  const ph = play ?? 0
  for (let i = 0; i < lens.length; i++) {
    if (ph < at + lens[i] || i === lens.length - 1) {
      idx = i
      break
    }
    at += lens[i]
  }
  const local = ph - at
  const nextFade = tl.xfades.has(idx) && lens[idx] - local < 0.5 && idx + 1 < tl.clips.length ? 1 - (lens[idx] - local) / 0.5 : 0
  const filter = tl.look ? LOOKS[tl.look] : 'none'
  const shown = tl.clips[idx]

  return (
    <div className="edit-grid">
      <div>
        <h2 className="display">Then it cuts the film.</h2>
        <p className="lede">
          Takes go to an editor where every change is an operation in an append-only log. The timeline is derived from the log, so undo means
          dropping the last operation, and the render can never disagree with what you see.
        </p>
        <div className="edit-stats">
          <div>
            <strong className="num">24</strong>
            <span className="small">edit primitives</span>
          </div>
          <div>
            <strong className="num">9</strong>
            <span className="small">looks</span>
          </div>
          <div>
            <strong className="num">79</strong>
            <span className="small">unit tests</span>
          </div>
        </div>
        <p className="small" style={{ marginTop: 18, maxWidth: '32em' }}>
          Takes you roll in the shot above land on this timeline. Undo and redo walk the same log the real editor keeps.
        </p>
      </div>
      <div className="editor">
        <div className="editor-top">
          <div className="preview">
            {tl.clips.map((c, i) => (
              <img
                key={c.take.id}
                src={c.take.thumb ?? ''}
                alt=""
                style={{ opacity: i === idx ? 1 - nextFade : i === idx + 1 ? nextFade : 0, filter }}
              />
            ))}
            <span className="preview-tag">{shown ? `${label(shown.take, idx)}  ${shown.take.template}` : 'No clips yet'}</span>
          </div>
          <ol className="ops" aria-label="Edit operations">
            {ops.map((op, i) => (
              <li key={i} data-undone={i >= cursor}>
                {opText(op, takes)}
              </li>
            ))}
          </ol>
        </div>
        <div className="track" aria-label="Timeline">
          {tl.clips.map((c, i) => (
            <div
              key={c.take.id}
              className="clip"
              data-mine={c.take.mine}
              style={{ flexGrow: lens[i], backgroundImage: c.take.thumb ? `url(${c.take.thumb})` : undefined, filter }}
            >
              <span>{label(c.take, i)}</span>
            </div>
          ))}
          {tl.clips.map((_, i) =>
            tl.xfades.has(i) ? (
              <i key={`x${i}`} className="xfade" style={{ left: `calc(6px + (100% - 12px) * ${lens.slice(0, i + 1).reduce((a, b) => a + b, 0) / Math.max(total, 0.01)})` }} />
            ) : null,
          )}
          {play != null && <i className="playhead" style={{ left: `calc(6px + (100% - 12px) * ${ph / total})` }} />}
        </div>
        <div className="editor-actions">
          <button className="tool tool-primary" onClick={startPlay} disabled={!total || play != null}>
            {play != null ? 'Playing' : 'Play edit'}
          </button>
          <button className="tool" onClick={() => setCursor((c) => Math.max(0, c - 1))} disabled={cursor === 0}>
            Undo
          </button>
          <button className="tool" onClick={() => setCursor((c) => Math.min(ops.length, c + 1))} disabled={cursor === ops.length}>
            Redo
          </button>
          <span className="small num">
            {cursor} of {ops.length} operations, {total.toFixed(1)} s
          </span>
        </div>
      </div>
    </div>
  )
}
