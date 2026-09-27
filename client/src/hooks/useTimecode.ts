import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

/** HH:MM:SS:FF at 24 fps. `mode: 'clock'` shows local time in a zone; 'elapsed' counts since mount. */
export function useTimecode(mode: 'clock' | 'elapsed', timeZone?: string) {
  const [text, setText] = useState('00:00:00:00')
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    let last = ''
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const tick = () => {
      let out: string
      if (mode === 'elapsed') {
        const ms = performance.now() - start
        const s = Math.floor(ms / 1000)
        out = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(Math.floor((ms % 1000) / (1000 / 24)))}`
      } else {
        const now = new Date()
        out = `${fmt.format(now)}:${pad(Math.floor(now.getMilliseconds() / (1000 / 24)))}`
      }
      if (out !== last) {
        last = out
        setText(out)
      }
      raf = requestAnimationFrame(tick)
    }
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [mode, timeZone])
  return text
}
