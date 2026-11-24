import { useEffect, useRef } from 'react'
import type { PageId } from '../lib/pages'

/**
 * The lamp glow, drawn as pixels. Light from one lamp falls across the page
 * and is ordered-dithered (8×8 Bayer) into a grid of small squares: dense
 * near the lamp, thinning to nothing. Each page hangs the lamp somewhere
 * else, and it glides there when you switch tabs. Pixel dust drifts through
 * the light, and the pointer warms the pixels around it.
 *
 * One fixed canvas behind everything, pointer-events off. Pitch and square
 * are whole CSS pixels, so the canvas is drawn at 1× and scaled up with
 * image-rendering: pixelated: crisp on retina at a quarter of the work.
 * The dither has its own canvas and is only redrawn when the light moves,
 * the window resizes or the theme changes; the dust ticks at 15 fps.
 * Reduced motion gets the still dither: no dust, no glide, no pointer.
 * Narrow screens have no margins, so the pixels thin out and the dust stays off.
 */

type Light = { x: number; y: number; rx: number; ry: number; power: number }

// x, y: where the lamp hangs, as fractions of the viewport (y < 0 is above it).
// rx, ry: how far the light reaches. power: peak pixel density.
const LIGHTS: Record<PageId, Light> = {
  home: { x: 0.9, y: -0.1, rx: 0.62, ry: 0.92, power: 0.82 }, // over the seal, top right
  work: { x: 0.08, y: -0.08, rx: 0.62, ry: 0.92, power: 0.8 }, // top left
  projects: { x: 1.04, y: 0.42, rx: 0.5, ry: 0.95, power: 0.8 }, // from the right side
  hackathons: { x: 0.12, y: 1.08, rx: 0.66, ry: 0.85, power: 0.78 }, // low, from the bottom left
}

type Ink = { dot: string; aMin: number; aMax: number; mote: string; moteA: number }
const INKS: Record<'dark' | 'light', Ink> = {
  dark: { dot: '255 172 104', aMin: 0.04, aMax: 0.27, mote: '255 212 160', moteA: 0.55 },
  light: { dot: '126 82 40', aMin: 0.035, aMax: 0.2, mote: '140 86 36', moteA: 0.45 },
}

const PITCH = 5 // CSS px between pixel centres
const DOT = 4 // CSS px square: a 1 px gap, so the dither reads as pixels
const LEVELS = 6 // alpha steps
const GLIDE_MS = 1200
const COLUMN = 360 // half the content column, where the pixels thin out
const NARROW = 820 // below this the column fills the screen: thinner pixels, no dust
const INSIDE = 0.2 // pixel density left behind the text

// 8×8 Bayer matrix as thresholds in (0, 1).
const BAYER = (() => {
  const m = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21]
  return Float32Array.from(m, v => (v + 0.5) / 64)
})()

type Mote = { x: number; y: number; vx: number; vy: number; age: number; life: number; phase: number; sparkle: number }

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const mix = (a: Light, b: Light, t: number): Light => ({
  x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, rx: a.rx + (b.rx - a.rx) * t,
  ry: a.ry + (b.ry - a.ry) * t, power: a.power + (b.power - a.power) * t,
})

export function PixelLamp({ page }: { page: PageId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dustRef = useRef<HTMLCanvasElement>(null)
  const pageRef = useRef(page)
  const glideTo = useRef<((target: Light) => void) | null>(null)

  useEffect(() => {
    pageRef.current = page
    glideTo.current?.(LIGHTS[page])
    const l = LIGHTS[page]
    document.documentElement.style.setProperty('--lamp-x', `${(l.x * 100).toFixed(1)}%`)
    document.documentElement.style.setProperty('--lamp-y', `${(l.y * 100).toFixed(1)}%`)
  }, [page])

  useEffect(() => {
    // off: the dither, redrawn only when the light changes.
    // canvas: dust and pointer pixels, which clear only the cells they used.
    const off = canvasRef.current, canvas = dustRef.current
    if (!off || !canvas) return
    const offCtx = off.getContext('2d')
    const ctx = canvas.getContext('2d')
    if (!ctx || !offCtx) return
    let drawn: number[] = [] // x, y, w, h of everything on the dust layer

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    let still = motion.matches
    let ink = INKS[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark']
    let w = 0, h = 0, lampH = 0, dpr = 1, cols = 0, rows = 0
    let light: Light = { ...LIGHTS[pageRef.current] }
    let from: Light = light, to: Light = light, glideStart = 0, gliding = false
    let motes: Mote[] = []
    const pointer = { x: -1e4, y: -1e4, power: 0, target: 0, last: 0 }
    let raf = 0, idle = 0, lastMoteTick = 0, lastDraw = 0, dirty = true

    // Light before the column mask: used for dust, which may cross the text.
    const glow = (x: number, y: number, l: Light) => {
      const dx = (x - l.x * w) / (l.rx * Math.max(w, 420))
      const dy = (y - l.y * lampH) / (l.ry * lampH)
      return Math.exp(-(dx * dx + dy * dy) * 1.7)
    }
    // Behind the text column the pixels thin out, so copy stays easy to read.
    const column = (x: number) => (w < NARROW ? 0.3 : INSIDE + (1 - INSIDE) * smoothstep(COLUMN - 60, COLUMN + 240, Math.abs(x - w / 2)))
    const level = (v: number, l: Light) => Math.min(LEVELS - 1, Math.floor((v / l.power) * LEVELS))
    const fill = (c: CanvasRenderingContext2D, rgb: string, a: number) => { c.fillStyle = `rgb(${rgb} / ${a.toFixed(3)})` }
    const alphaOf = (lv: number) => ink.aMin + ((ink.aMax - ink.aMin) * (lv + 1)) / LEVELS
    const dotRect = (path: Path2D, c: number, r: number) => {
      const s = Math.max(1, Math.round(DOT * dpr))
      path.rect(Math.round((c * PITCH + (PITCH - DOT) / 2) * dpr), Math.round((r * PITCH + (PITCH - DOT) / 2) * dpr), s, s)
    }

    // The falloff is separable: exp(-(dx² + dy²)) = exp(-dx²) · exp(-dy²).
    // One row and one column of factors per frame instead of one per pixel.
    let gx = new Float32Array(0), gy = new Float32Array(0)
    const drawDither = () => {
      offCtx.clearRect(0, 0, off.width, off.height)
      if (gx.length !== cols) gx = new Float32Array(cols)
      if (gy.length !== rows) gy = new Float32Array(rows)
      const sx = light.x * w, sy = light.y * lampH, rx = light.rx * Math.max(w, 420), ry = light.ry * lampH
      for (let c = 0; c < cols; c++) { const x = c * PITCH + PITCH / 2, d = (x - sx) / rx; gx[c] = light.power * Math.exp(-d * d * 1.7) * column(x) }
      for (let r = 0; r < rows; r++) { const d = (r * PITCH + PITCH / 2 - sy) / ry; gy[r] = Math.exp(-d * d * 1.7) }
      const paths = Array.from({ length: LEVELS }, () => new Path2D())
      const used = new Uint8Array(LEVELS)
      for (let r = 0; r < rows; r++) {
        const fy = gy[r]
        if (fy < 0.008) continue
        for (let c = 0; c < cols; c++) {
          const v = gx[c] * fy
          if (v < 0.008 || v <= BAYER[(r & 7) * 8 + (c & 7)]) continue
          const lv = level(v, light)
          dotRect(paths[lv], c, r)
          used[lv] = 1
        }
      }
      for (let lv = 0; lv < LEVELS; lv++) {
        if (!used[lv]) continue
        fill(offCtx, ink.dot, alphaOf(lv))
        offCtx.fill(paths[lv])
      }
    }

    // Pixels the pointer adds: cells that are dark in the dither but cross
    // their threshold once the pointer's warmth is added.
    const drawPointer = () => {
      if (pointer.power < 0.01) return
      const R = 130
      const c0 = Math.max(0, Math.floor((pointer.x - R) / PITCH)), c1 = Math.min(cols - 1, Math.ceil((pointer.x + R) / PITCH))
      const r0 = Math.max(0, Math.floor((pointer.y - R) / PITCH)), r1 = Math.min(rows - 1, Math.ceil((pointer.y + R) / PITCH))
      const paths = Array.from({ length: LEVELS }, () => new Path2D())
      const used = new Uint8Array(LEVELS)
      for (let r = r0; r <= r1; r++) {
        const y = r * PITCH + PITCH / 2
        for (let c = c0; c <= c1; c++) {
          const x = c * PITCH + PITCH / 2
          const d2 = (x - pointer.x) ** 2 + (y - pointer.y) ** 2
          if (d2 > R * R) continue
          const t = BAYER[(r & 7) * 8 + (c & 7)]
          const base = light.power * glow(x, y, light) * column(x)
          if (base > t) continue
          const boost = 0.5 * pointer.power * Math.exp(-d2 / (R * R * 0.32))
          const v = base + boost
          if (v <= t) continue
          const lv = Math.min(LEVELS - 1, level(v, light) + 1)
          dotRect(paths[lv], c, r)
          used[lv] = 1
        }
      }
      for (let lv = 0; lv < LEVELS; lv++) {
        if (!used[lv]) continue
        fill(ctx, ink.dot, alphaOf(lv))
        ctx.fill(paths[lv])
      }
      drawn.push((c0 - 1) * PITCH, (r0 - 1) * PITCH, (c1 - c0 + 3) * PITCH, (r1 - r0 + 3) * PITCH)
    }

    const spawn = (anywhere = false): Mote => {
      let x = 0, y = 0
      for (let i = 0; i < 24; i++) {
        x = Math.random() * w
        y = Math.random() * h
        if (glow(x, y, light) > 0.22 + Math.random() * 0.4) break
      }
      const life = 7 + Math.random() * 9
      return { x, y, vx: (Math.random() - 0.5) * 6, vy: -(3 + Math.random() * 7), age: anywhere ? Math.random() * life : 0, life, phase: Math.random() * 6.28, sparkle: Math.random() < 0.22 ? 4 + Math.random() * (life - 6) : -1 }
    }

    const drawMotes = () => {
      const s = Math.max(1, Math.round(DOT * dpr))
      for (const m of motes) {
        const fade = Math.sin((Math.PI * m.age) / m.life)
        const keepOff = smoothstep(COLUMN - 10, COLUMN + 70, Math.abs(m.x - w / 2))
        const a = ink.moteA * fade * keepOff * Math.min(1, glow(m.x, m.y, light) * 1.8)
        if (a < 0.02) continue
        const c = Math.floor(m.x / PITCH), r = Math.floor(m.y / PITCH)
        const px = (cc: number, rr: number, alpha: number) => {
          const x = Math.round((cc * PITCH + (PITCH - DOT) / 2) * dpr), y = Math.round((rr * PITCH + (PITCH - DOT) / 2) * dpr)
          fill(ctx, ink.mote, alpha)
          ctx.fillRect(x, y, s, s)
          drawn.push(x, y, s, s)
        }
        px(c, r, a)
        // A few motes catch the light for a moment: a small pixel cross.
        if (m.sparkle > 0 && Math.abs(m.age - m.sparkle) < 0.45) {
          const k = a * (1 - Math.abs(m.age - m.sparkle) / 0.45) * 0.7
          px(c - 1, r, k); px(c + 1, r, k); px(c, r - 1, k); px(c, r + 1, k)
        }
      }
    }

    const moteCount = () => (still || w < NARROW ? 0 : Math.round(Math.min(24, (w * h) / 46000)))

    const resize = () => {
      const nw = window.innerWidth, nh = window.innerHeight
      // Mobile toolbars change the height while scrolling; keep the light's
      // scale steady for a given width so the pixels do not jitter.
      lampH = nw === w ? Math.max(lampH, nh) : nh
      w = nw; h = nh
      dpr = 1
      cols = Math.ceil(w / PITCH) + 1
      rows = Math.ceil(h / PITCH) + 1
      for (const c of [canvas, off]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr) }
      drawn = []
      const n = moteCount()
      motes = Array.from({ length: n }, () => spawn(true))
      dirty = true
    }

    const frame = (now: number) => {
      raf = 0
      // Behind an open case study nothing shows: keep time, draw nothing.
      if (document.querySelector('.case-study')) {
        if (!still && !document.hidden) idle = window.setTimeout(() => { idle = 0; raf = requestAnimationFrame(frame) }, 250)
        return
      }
      if (gliding) {
        const t = Math.min(1, (now - glideStart) / GLIDE_MS)
        light = mix(from, to, easeInOut(t))
        dirty = true
        if (t >= 1) gliding = false
      }
      pointer.power += (pointer.target - pointer.power) * 0.16
      const pointerLive = Math.abs(pointer.target - pointer.power) > 0.005 || now - pointer.last < 120
      const moteDue = !still && now - lastMoteTick >= 1000 / 15
      const pointerDue = pointerLive && now - lastDraw >= 1000 / 30
      if (dirty || pointerDue || moteDue) {
        lastDraw = now
        if (moteDue) {
          const dt = Math.min(0.2, (now - (lastMoteTick || now)) / 1000)
          lastMoteTick = now
          for (let i = 0; i < motes.length; i++) {
            const m = motes[i]
            m.age += dt
            m.x += (m.vx + Math.sin(m.age * 0.9 + m.phase) * 5) * dt
            m.y += m.vy * dt
            if (m.age >= m.life || m.y < -10 || m.x < -10 || m.x > w + 10) motes[i] = spawn()
          }
        }
        if (dirty) { drawDither(); dirty = false }
        for (let i = 0; i < drawn.length; i += 4) ctx.clearRect(drawn[i] - 1, drawn[i + 1] - 1, drawn[i + 2] + 2, drawn[i + 3] + 2)
        drawn = []
        drawPointer()
        drawMotes()
      }
      if (still || document.hidden) return
      // Gliding or following the pointer: every frame. Otherwise only the
      // dust moves, so wake up at its 15 fps instead of spinning rAF.
      if (gliding || pointerLive || Math.abs(pointer.target - pointer.power) > 0.005) raf = requestAnimationFrame(frame)
      else if (motes.length) idle = window.setTimeout(() => { idle = 0; raf = requestAnimationFrame(frame) }, 1000 / 15)
    }
    const kick = () => {
      if (raf) return
      if (idle) { window.clearTimeout(idle); idle = 0 }
      raf = requestAnimationFrame(frame)
    }

    glideTo.current = target => {
      if (still || !w) { light = { ...target }; dirty = true; kick(); return }
      from = light; to = target; glideStart = performance.now(); gliding = true
      kick()
    }

    let resizeTimer = 0
    const onResize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { resize(); kick() }, 100) }
    const onPointer = (e: PointerEvent) => {
      if (still || e.pointerType !== 'mouse' || !fine.matches) return
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.target = 1; pointer.last = performance.now()
      kick()
    }
    const onLeave = () => { pointer.target = 0; kick() }
    const onVisible = () => { if (!document.hidden) { lastMoteTick = 0; kick() } }
    const onMotion = () => { still = motion.matches; resize(); kick() }
    const themeWatch = new MutationObserver(() => {
      ink = INKS[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark']
      dirty = true
      kick()
    })

    resize()
    kick()
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisible)
    motion.addEventListener('change', onMotion)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(idle)
      window.clearTimeout(resizeTimer)
      glideTo.current = null
      themeWatch.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisible)
      motion.removeEventListener('change', onMotion)
    }
  }, [])

  return <>
    <canvas ref={canvasRef} className="pixel-lamp" aria-hidden="true" />
    <canvas ref={dustRef} className="pixel-lamp" aria-hidden="true" />
  </>
}
