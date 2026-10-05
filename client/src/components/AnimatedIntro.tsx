import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import './AnimatedIntro.css'

const name = [...'Caesar.']

export function AnimatedIntro() {
  const reduce = !!useReducedMotion()
  const [sequence, setSequence] = useState(0)
  const [revealing, setRevealing] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const letters = useRef<(HTMLSpanElement | null)[]>([])
  const frame = useRef(0)
  const finish = useRef(0)
  const playing = useRef(false)

  const reset = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    letters.current.forEach(letter => {
      letter?.style.setProperty('--energy', '0')
      letter?.style.setProperty('--lean', '0')
      letter?.style.setProperty('--tint', '0%')
    })
  }, [])

  const replay = useCallback(() => {
    window.clearTimeout(finish.current)
    reset()
    if (reduce) { playing.current = false; setRevealing(false); return }
    playing.current = true
    setSequence(value => value + 1)
    setRevealing(true)
    finish.current = window.setTimeout(() => {
      playing.current = false
      setRevealing(false)
    }, 1400)
  }, [reduce, reset])

  useEffect(() => {
    let active = true
    // Start after the serif face is ready; the greeting stays visible while loading.
    void document.fonts.ready.then(() => { if (active) replay() })
    return () => {
      active = false
      window.clearTimeout(finish.current)
      reset()
    }
  }, [replay, reset])

  const follow = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduce || playing.current || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const width = rect.width
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      letters.current.forEach(letter => {
        if (!letter) return
        const center = letter.offsetLeft + letter.offsetWidth / 2
        const distance = (x - center) / Math.max(40, width * .27)
        const energy = Math.exp(-distance * distance * 2)
        letter.style.setProperty('--energy', energy.toFixed(3))
        letter.style.setProperty('--lean', Math.max(-1, Math.min(1, distance)).toFixed(3))
        letter.style.setProperty('--tint', `${(energy * 60).toFixed(1)}%`)
      })
    })
  }

  return <h1 id="intro-title" aria-label="Hi, I'm Caesar." className="animated-intro font-serif text-[52px] leading-[1.08] tracking-[-0.035em] text-fg sm:text-[64px]">
    <span aria-hidden="true" className="intro-greeting">Hi, I'm </span>
    <button ref={button} type="button" className="signature-name" data-revealing={revealing}
      aria-label={reduce ? 'Caesar' : 'Replay the name animation'} aria-disabled={reduce || undefined} tabIndex={reduce ? -1 : 0}
      title={reduce ? undefined : 'Click to replay the name animation'} onClick={replay}
      onPointerMove={follow} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset}>
      {name.map((character, index) => <span key={`${sequence}-${index}`} ref={el => { letters.current[index] = el }} aria-hidden="true"
        className={`signature-letter${character === '.' ? ' signature-letter-period' : ''}`} data-letter={character}
        style={{ '--letter-index': index, '--letter-accent': index < 3 ? 'var(--wood)' : 'var(--fire)' } as CSSProperties}>
        <span className="signature-letter-ink">{character}</span>
      </span>)}
      <span className="signature-name-rule" aria-hidden="true" />
    </button>
  </h1>
}
