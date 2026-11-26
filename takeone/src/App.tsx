import { useEffect } from 'react'
import { rt, useUi } from './store'
import { initScroll, measure } from './lib/scroll'
import { Stage } from './three/Stage'
import { Intro } from './ui/Intro'
import { FrameCorners, Grain, Hud, Labels, Nav, Rail, Subtitles } from './ui/Chrome'
import { Direct, Edit, Hero, Rehearse, RigSection, Talk, Wrap } from './ui/Sections'

rt.reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
rt.mobile = typeof window !== 'undefined' && window.innerWidth < 820

export default function App() {
  const dark = useUi((s) => s.dark)
  const introDone = useUi((s) => s.introDone)

  useEffect(() => {
    const stop = initScroll(rt.reduced)
    const onMove = (e: PointerEvent) => {
      rt.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      rt.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    const t = window.setTimeout(measure, 400)
    let raf = 0
    const fade = () => {
      // anything sliding up under the nav fades out instead of colliding with it
      document
        .querySelectorAll<HTMLElement>('.copy > *, .direct-grid > div:first-child > *, .edit-grid > div:first-child > *, .gallery-head > *, .monitor, .editor')
        .forEach((el) => {
          const r = el.getBoundingClientRect()
          const o = r.height < 220 ? (r.top - 40) / 64 : (r.bottom - 150) / 220
          el.style.setProperty('--fade', Math.min(1, Math.max(0, o)).toFixed(3))
        })
      raf = requestAnimationFrame(fade)
    }
    raf = requestAnimationFrame(fade)
    return () => {
      stop()
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    document.body.dataset.dark = String(dark)
  }, [dark])
  useEffect(() => {
    document.body.dataset.intro = introDone ? 'done' : 'playing'
    if (!introDone) return
    const t = window.setTimeout(() => (document.body.dataset.settled = 'true'), 1600)
    return () => window.clearTimeout(t)
  }, [introDone])

  return (
    <>
      <a className="skip" href="#direct">
        Skip to the interactive demo
      </a>
      <Stage />
      <div className="scrim" aria-hidden="true" />
      <Intro />
      <Nav />
      <Rail />
      <Hud />
      <FrameCorners />
      <Labels />
      <Subtitles />
      <main>
        <Hero />
        <Talk />
        <Rehearse />
        <Direct />
        <Edit />
        <RigSection />
        <Wrap />
      </main>
      {!rt.reduced && <Grain />}
    </>
  )
}
