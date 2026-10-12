import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Slide } from '../content/onepage'
import { IconChevronRight, IconTrophy } from './icons'

/**
 * Swipeable featured carousel. Scroll-snap gives native touch swiping;
 * the arrow buttons and Left/Right keys move one slide at a time.
 */
export function FeatureCarousel({ slides, badge, title }: { slides: Slide[]; badge: string; title: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  const goTo = useCallback((next: number) => {
    const el = track.current
    if (!el) return
    const clamped = Math.max(0, Math.min(slides.length - 1, next))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: reduce ? 'instant' : 'smooth' })
  }, [slides.length, reduce])

  // Keep the counter in sync with swipes and button scrolls.
  useEffect(() => {
    const el = track.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1) }
  }

  const current = slides[index] ?? slides[0]

  return <figure className="op-feature" aria-roledescription="carousel" aria-label={title}>
    <div className="op-carousel">
      <div ref={track} className="op-carousel-track" tabIndex={0} onKeyDown={onKey} aria-live="polite">
        {slides.map((s, i) => <div key={s.src} className={`op-slide op-slide-${s.kind}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} aria-hidden={i !== index || undefined}>
          {s.kind === 'phone'
            ? <div className="op-phone"><img src={s.src} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} draggable={false} /></div>
            : <img src={s.src} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />}
        </div>)}
      </div>
      <span className="op-feature-badge"><IconTrophy size={13} />{badge}</span>
      <button type="button" className="op-carousel-btn op-carousel-prev" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous picture">
        <IconChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
      </button>
      <button type="button" className="op-carousel-btn op-carousel-next" onClick={() => goTo(index + 1)} disabled={index === slides.length - 1} aria-label="Next picture">
        <IconChevronRight size={18} />
      </button>
      <span className="op-carousel-count" aria-hidden="true">{index + 1} / {slides.length}</span>
    </div>
    <figcaption>
      <span><strong>TakeOne</strong> · highest score of the 12 finalists</span>
      <span className="op-feature-cap">{current.caption}</span>
    </figcaption>
  </figure>
}
