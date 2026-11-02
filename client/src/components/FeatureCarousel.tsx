import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Slide } from '../content/onepage'
import { IconChevronRight } from './icons'

/**
 * Photo carousel. Scroll-snap gives native touch swiping; the arrow buttons
 * and Left/Right keys move one slide at a time.
 */
export function FeatureCarousel({ slides, label }: { slides: Slide[]; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  const goTo = useCallback((next: number) => {
    const el = track.current
    if (!el) return
    const clamped = Math.max(0, Math.min(slides.length - 1, next))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: reduce ? 'instant' : 'smooth' })
  }, [slides.length, reduce])

  // Keep the index in sync with swipes and button scrolls.
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

  return <figure className="op-feature" aria-roledescription="carousel" aria-label={label}>
    <div className="op-carousel">
      <div ref={track} className="op-carousel-track" tabIndex={0} onKeyDown={onKey}>
        {slides.map((s, i) => <div key={s.src} className="op-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} aria-hidden={i !== index || undefined}>
          <img src={s.src} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
        </div>)}
      </div>
      <button type="button" className="op-carousel-btn op-carousel-prev" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous photo">
        <IconChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
      </button>
      <button type="button" className="op-carousel-btn op-carousel-next" onClick={() => goTo(index + 1)} disabled={index === slides.length - 1} aria-label="Next photo">
        <IconChevronRight size={18} />
      </button>
    </div>
  </figure>
}
