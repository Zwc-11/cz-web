import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Muted looping clip that plays only while it is on screen.
 * With reduced motion it stays on its poster frame; `controls` lets people start it themselves.
 */
export function LoopVideo({ src, webm, poster, label, className, controls = false }: {
  src: string; webm?: string; poster: string; label: string; className?: string; controls?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || reduce) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => { /* autoplay refused: the poster stays */ })
      else video.pause()
    }, { threshold: 0.35 })
    io.observe(video)
    return () => { io.disconnect(); video.pause() }
  }, [reduce])

  // WebM (VP9) first for browsers without H.264, MP4 for Safari.
  return <video ref={ref} className={className} poster={poster} aria-label={label}
    muted loop playsInline preload={reduce ? 'none' : 'metadata'} controls={controls} disablePictureInPicture>
    {webm && <source src={webm} type="video/webm" />}
    <source src={src} type="video/mp4" />
  </video>
}
