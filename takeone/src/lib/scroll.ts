import Lenis from 'lenis'
import { rt, setUi } from '../store'

const sections: HTMLElement[] = []
let tops: number[] = []
let lenis: Lenis | null = null

export function registerSection(i: number, el: HTMLElement | null) {
  if (el) sections[i] = el
}

export function measure() {
  rt.vw = window.innerWidth
  rt.vh = window.innerHeight
  rt.mobile = rt.vw < 820
  tops = sections.map((el) => el.getBoundingClientRect().top + window.scrollY)
  tops.push(Math.max(document.documentElement.scrollHeight, (tops[tops.length - 1] ?? 0) + rt.vh))
  update(window.scrollY)
}

function update(y: number) {
  rt.scrollY = y
  if (tops.length < 2) return
  const vh = rt.vh
  let i = 0
  while (i < tops.length - 2 && y >= tops[i + 1] - 0.15 * vh) i++
  const top = tops[i]
  const next = tops[i + 1]
  const last = i >= sections.length - 1
  const span = Math.max(1, next - top - (last ? vh : 0.15 * vh))
  rt.shot = i
  rt.f = Math.min(1, Math.max(0, (y - top) / span))
  if (last) {
    rt.blend = 0
  } else {
    const a = next - 0.85 * vh
    const b = next - 0.15 * vh
    const t = Math.min(1, Math.max(0, (y - a) / (b - a)))
    rt.blend = t
  }
  rt.s = i + rt.blend
  setUi({ shot: rt.blend > 0.5 ? i + 1 : i })
}

export function initScroll(reduced: boolean) {
  const onResize = () => measure()
  window.addEventListener('resize', onResize)
  const ro = new ResizeObserver(() => measure())
  ro.observe(document.body)
  if (!reduced) {
    lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 0.95 })
    lenis.on('scroll', (l: Lenis) => update(l.scroll))
  } else {
    window.addEventListener('scroll', () => update(window.scrollY), { passive: true })
  }
  measure()
  return () => {
    window.removeEventListener('resize', onResize)
    ro.disconnect()
    lenis?.destroy()
  }
}

export function scrollToSection(i: number) {
  const el = sections[i]
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: rt.reduced ? 'auto' : 'smooth' })
}

export function lockScroll(lock: boolean) {
  if (!lenis) return
  if (lock) lenis.stop()
  else lenis.start()
}
