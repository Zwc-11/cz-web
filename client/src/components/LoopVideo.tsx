import { useEffect, useRef } from 'react'

/** Muted looping clip: plays while it is on screen, pauses when scrolled away. */
export function LoopVideo({ src, webm, poster, label, className, controls = false }: {
  src: string; webm?: string; poster: string; label: string; className?: string; controls?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true // React does not always set the muted attribute, and autoplay needs it
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => { /* autoplay refused: the poster stays */ })
      else video.pause()
    }, { threshold: 0.2 })
    io.observe(video)
    return () => { io.disconnect(); video.pause() }
  }, [])

  // WebM (VP9) first for browsers without H.264, MP4 for Safari.
  return <video ref={ref} className={className} poster={poster} aria-label={label}
    autoPlay muted loop playsInline preload="auto" controls={controls} disablePictureInPicture>
    {webm && <source src={webm} type="video/webm" />}
    <source src={src} type="video/mp4" />
  </video>
}
