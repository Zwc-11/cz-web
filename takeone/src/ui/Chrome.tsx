import { useEffect, useMemo } from 'react'
import { rt, setUi, useUi } from '../store'
import { SHOTS } from '../three/choreography'
import { LINKS, LABELS, TALK_LINES } from '../content'
import { scrollToSection } from '../lib/scroll'
import { canSpeak, hush } from '../lib/voice'
import { useDerived, sectionProgress } from '../lib/useProgress'

export function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export function Nav() {
  const introDone = useUi((s) => s.introDone)
  const rolling = useUi((s) => s.rolling)
  const voice = useUi((s) => s.voice)
  return (
    <header className="nav" data-hidden={!introDone}>
      <a className="wordmark" href="#top" onClick={(e) => (e.preventDefault(), scrollToSection(0))}>
        <span className="tally" data-on={rolling} aria-hidden="true" />
        TakeOne
      </a>
      <nav className="nav-right" aria-label="Page">
        <button className="nav-link" onClick={() => scrollToSection(3)}>
          Direct a shot
        </button>
        {canSpeak && (
          <button
            className="nav-link"
            aria-pressed={voice}
            onClick={() => {
              if (voice) hush()
              setUi({ voice: !voice })
            }}
          >
            {voice ? 'Voice on' : 'Voice off'}
          </button>
        )}
        <a className="btn btn--ghost" href={LINKS.github} target="_blank" rel="noreferrer">
          <GitHubMark />
          GitHub
        </a>
      </nav>
    </header>
  )
}

export function Rail() {
  const shot = useUi((s) => s.shot)
  const introDone = useUi((s) => s.introDone)
  return (
    <nav className="rail" aria-label="Sections" data-hidden={!introDone}>
      {SHOTS.map((s, i) => (
        <button key={s.id} aria-current={shot === i} onClick={() => scrollToSection(i)} aria-label={`${s.title}, shot ${i + 1}`}>
          <span className="rail-label">{s.title}</span>
          <span className="tick" />
        </button>
      ))}
    </nav>
  )
}

export function Hud() {
  const shot = useUi((s) => s.shot)
  const introDone = useUi((s) => s.introDone)
  // the gallery and the two interactive panels carry their own information
  const inGallery = useDerived(() => rt.shot === 5 && rt.f > 0.62)
  return (
    <div className="hud num" data-hidden={!introDone || shot === 3 || shot === 4 || inGallery} aria-hidden="true">
      <span>
        Shot {shot + 1} of {SHOTS.length}
      </span>
      <span className="hud-move">{SHOTS[shot].move}</span>
      <span className="hud-clock" ref={(el) => {
            rt.hudClock = el
          }}>
        00:00:00:00
      </span>
    </div>
  )
}

export function FrameCorners() {
  const introDone = useUi((s) => s.introDone)
  return (
    <div className="frame-corners" data-hidden={!introDone} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  )
}

export function Grain() {
  const url = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 160
    const g = c.getContext('2d')!
    const d = g.createImageData(160, 160)
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v
      d.data[i + 3] = 255
    }
    g.putImageData(d, 0, 0)
    return c.toDataURL()
  }, [])
  return <div className="grain" style={{ backgroundImage: `url(${url})` }} aria-hidden="true" />
}

export function Labels() {
  return (
    <div className="labels" aria-hidden="true">
      {LABELS.map((l, i) => (
        <div key={l} className="label" ref={(el) => {
            rt.labelEls[i] = el
          }}>
          <div className="label-inner">
            <span>{l}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Talk section dialogue, shown as subtitles while the camera pushes in.
export function Subtitles() {
  const line = useDerived(() => {
    const p = sectionProgress(1)
    if (p < 0) return -1
    const i = Math.floor((p - 0.06) / 0.17)
    return i < 0 || i >= TALK_LINES.length ? -1 : i
  })
  useEffect(() => {
    if (line >= 0 && TALK_LINES[line].who === 'TakeOne') rt.speaking = 1
  }, [line])
  if (line < 0) return null
  const l = TALK_LINES[line]
  return (
    <div className="subtitles" aria-hidden="true">
      <p className={`subtitle ${l.who === 'You' ? 'subtitle-you' : ''}`} key={line}>
        <b>{l.who}:</b> {l.text}
      </p>
    </div>
  )
}
