import { useEffect, useState } from 'react'
import { rt } from '../store'

// Opening: letterboxed black, the slate claps, the stage lights come up
// (the lights themselves are driven by the frame loop).
export function Intro() {
  const [play, setPlay] = useState(false)
  const [gone, setGone] = useState(rt.reduced)
  useEffect(() => {
    if (rt.reduced) return
    let raf = 0
    let t = 0
    // start once the 3D stage has drawn its first frame, so the clap lines up with the lights
    const wait = () => {
      if (rt.introStart > 0) {
        setPlay(true)
        t = window.setTimeout(() => setGone(true), 3000)
      } else raf = requestAnimationFrame(wait)
    }
    raf = requestAnimationFrame(wait)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
    }
  }, [])
  return (
    <div className="intro" data-play={play} data-gone={gone} aria-hidden="true">
      <div className="letterbox top" />
      <div className="letterbox bottom" />
      <svg className="slate" viewBox="0 0 300 236" fill="none">
        <g className="slate-stick">
          <rect x="6" y="6" width="288" height="34" rx="3" fill="#0b0b0b" stroke="#f2f2ee" strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${18 + i * 48} 7 L${44 + i * 48} 7 L${26 + i * 48} 39 L${0 + i * 48} 39 Z`} fill="#f2f2ee" />
          ))}
        </g>
        <rect x="6" y="46" width="288" height="34" rx="3" fill="#0b0b0b" stroke="#f2f2ee" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${0 + i * 48} 47 L${26 + i * 48} 47 L${44 + i * 48} 79 L${18 + i * 48} 79 Z`} fill="#f2f2ee" />
        ))}
        <rect x="6" y="86" width="288" height="144" rx="4" fill="#0b0b0b" stroke="#f2f2ee" strokeWidth="2" />
        <line x1="6" y1="150" x2="294" y2="150" stroke="#f2f2ee" strokeWidth="1.5" />
        <line x1="150" y1="150" x2="150" y2="230" stroke="#f2f2ee" strokeWidth="1.5" />
        <text x="22" y="132" fill="#f2f2ee" fontFamily="Archivo, sans-serif" fontSize="34" fontWeight="800" style={{ fontStretch: '66%' }}>
          TakeOne
        </text>
        <text x="22" y="174" fill="#9da0a6" fontFamily="Archivo, sans-serif" fontSize="13">
          Scene
        </text>
        <text x="22" y="214" fill="#f2f2ee" fontFamily="Archivo, sans-serif" fontSize="34" fontWeight="700">
          1
        </text>
        <text x="166" y="174" fill="#9da0a6" fontFamily="Archivo, sans-serif" fontSize="13">
          Take
        </text>
        <text x="166" y="214" fill="#f2f2ee" fontFamily="Archivo, sans-serif" fontSize="34" fontWeight="700">
          1
        </text>
      </svg>
      <div className="slate-flash" />
    </div>
  )
}
