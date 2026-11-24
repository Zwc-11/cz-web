import { useEffect, useRef } from 'react'
import type { PageId } from '../lib/pages'

/**
 * Pixel shapes scattered down both margins, full height, never behind the
 * text. Each shape is a small Game of Life pattern (still lifes,
 * oscillators, gliders), and the margins run Life slowly: blinkers blink,
 * gliders crawl until they reach the text column and stop. When shapes die
 * off, new ones appear somewhere free. Each page has its own arrangement,
 * which fades in on a tab switch. Moving the mouse through a margin warms
 * the pixels near it and now and then releases a glider.
 *
 * One canvas at 1× (pitch and squares are whole CSS pixels) scaled with
 * image-rendering: pixelated. It draws only while pixels fade, and sleeps
 * between generations. Hidden on screens too narrow to have margins; still
 * under reduced motion.
 */

const PITCH = 9 // CSS px per cell
const DOT = 7 // CSS px square (2 px gap)
const COLUMN = 360 // half the content column
const GAP = 36 // clear space between the column and the first pixels
const MIN_MARGIN_CELLS = 5
const GENERATION_MS = 1300
const FADE_MS = 110 // time constant for pixels fading in and out

type Ink = { rgb: string; aMin: number; aMax: number; warm: string }
const INKS: Record<'dark' | 'light', Ink> = {
  dark: { rgb: '236 218 194', aMin: 0.14, aMax: 0.46, warm: '227 171 136' },
  light: { rgb: '62 48 38', aMin: 0.2, aMax: 0.74, warm: '150 74 44' },
}

type Cells = [number, number][]
// Patterns as [x, y] cells. Still lifes, oscillators and a glider.
const STILL: Cells[] = [
  [[0, 0], [1, 0], [0, 1], [1, 1]], // block
  [[1, 0], [2, 0], [0, 1], [3, 1], [1, 2], [2, 2]], // beehive
  [[1, 0], [2, 0], [0, 1], [3, 1], [1, 2], [3, 2], [2, 3]], // loaf
  [[0, 0], [1, 0], [0, 1], [2, 1], [1, 2]], // boat
  [[1, 0], [0, 1], [2, 1], [1, 2]], // tub
  [[1, 0], [2, 0], [0, 1], [3, 1], [0, 2], [3, 2], [1, 3], [2, 3]], // pond
  [[0, 0], [1, 0], [0, 1], [2, 1], [1, 2], [2, 2]], // ship
  [[1, 0], [0, 1], [2, 1], [1, 2], [3, 2], [2, 3]], // barge
  [[1, 0], [2, 0], [0, 1], [3, 1], [1, 2], [4, 2], [2, 3], [3, 3]], // mango
  [[0, 0], [1, 0], [0, 1], [2, 1], [2, 2], [2, 3], [3, 3]], // eater
  [[0, 0], [1, 0], [0, 1], [2, 1], [1, 2], [3, 2], [2, 3]], // long boat
]
const OSCILLATORS: Cells[] = [
  [[0, 0], [1, 0], [2, 0]], // blinker
  [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]], // toad
  [[0, 0], [1, 0], [0, 1], [3, 2], [2, 3], [3, 3]], // beacon
  [[2, 0], [0, 1], [2, 1], [1, 2], [3, 2], [1, 3]], // clock
]
const GLIDER: Cells = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]

const PAGE_SEED: Record<PageId, number> = { home: 11, work: 23, projects: 37, hackathons: 53 }

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Rotate and/or mirror a pattern, then shift it back to (0, 0). */
function orient(cells: Cells, turn: number, flip: boolean): Cells {
  let out = cells.map(([x, y]) => [flip ? -x : x, y] as [number, number])
  for (let i = 0; i < turn; i++) out = out.map(([x, y]) => [-y, x] as [number, number])
  const mx = Math.min(...out.map(c => c[0])), my = Math.min(...out.map(c => c[1]))
  return out.map(([x, y]) => [x - mx, y - my] as [number, number])
}

function pick(rand: () => number): Cells {
  const r = rand()
  const set = r < 0.48 ? STILL : r < 0.82 ? OSCILLATORS : [GLIDER]
  return orient(set[Math.floor(rand() * set.length)], Math.floor(rand() * 4), rand() < 0.5)
}

export function PixelField({ page }: { page: PageId }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const pageRef = useRef(page)
  const onPage = useRef<((page: PageId) => void) | null>(null)

  useEffect(() => {
    pageRef.current = page
    onPage.current?.(page)
  }, [page])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    let still = motion.matches
    let ink = INKS[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark']

    let w = 0, h = 0, cols = 0, rows = 0, active = false
    let alive = new Uint8Array(0), next = new Uint8Array(0), age = new Uint8Array(0)
    let zone = new Uint8Array(0) // 1 where a pixel may live (the margins)
    let shown = new Float32Array(0), warmth = new Float32Array(0), tone = new Float32Array(0)
    let target = 0 // how many live cells the page should hold
    let raf = 0, timer = 0, seedTimer = 0, lastFrame = 0
    const pointer = { c: -1, r: -1, lastSpawn: 0, dx: 1, dy: 1, x: 0, y: 0 }

    const idx = (c: number, r: number) => r * cols + c
    const free = (cells: Cells, c0: number, r0: number, pad: number) => {
      for (const [x, y] of cells) {
        for (let dy = -pad; dy <= pad; dy++) for (let dx = -pad; dx <= pad; dx++) {
          const c = c0 + x + dx, r = r0 + y + dy
          if (c < 0 || r < 0 || c >= cols || r >= rows) return false
          if (!zone[idx(c, r)] || alive[idx(c, r)]) return false
        }
      }
      return true
    }
    const place = (cells: Cells, c0: number, r0: number, shade: number, warm = 0) => {
      for (const [x, y] of cells) {
        const i = idx(c0 + x, r0 + y)
        alive[i] = 1; age[i] = 3; tone[i] = shade
        if (warm) warmth[i] = Math.max(warmth[i], warm)
      }
    }
    /** Drop one random pattern somewhere free, near (cx, cy) when given. */
    const scatter = (rand: () => number, shade: number, cx = -1, cy = -1, spread = 7) => {
      for (let tries = 0; tries < 40; tries++) {
        const cells = pick(rand)
        const c0 = cx < 0 ? Math.floor(rand() * cols) : Math.round(cx + (rand() - 0.5) * 2 * spread)
        const r0 = cy < 0 ? Math.floor(rand() * rows) : Math.round(cy + (rand() - 0.5) * 2 * spread)
        if (free(cells, c0, r0, 2)) { place(cells, c0, r0, shade); return cells.length }
      }
      return 0
    }
    /** A random margin cell on one side (0 left, 1 right) or either. */
    const randomZoneCell = (rand: () => number, side = -1) => {
      const half = Math.floor(cols / 2)
      for (let tries = 0; tries < 60; tries++) {
        const c = side < 0 ? Math.floor(rand() * cols) : side * half + Math.floor(rand() * half), r = Math.floor(rand() * rows)
        if (zone[idx(c, r)]) return [c, r]
      }
      return [-1, -1]
    }

    const seed = (id: PageId) => {
      alive.fill(0); age.fill(0)
      if (!active) return
      const rand = rng(PAGE_SEED[id] * 7919 + cols * 131 + rows)
      let marginCells = 0
      for (let i = 0; i < zone.length; i++) marginCells += zone[i]
      // Clumps of a few shapes, like constellations, plus loose singles.
      // Each clump has its own shade, so some read lighter than others.
      let count = 0
      // Alternate sides, and work down the page in bands, so both margins
      // fill evenly from top to bottom.
      const clumps = Math.round(marginCells / 850), singles = Math.round(marginCells / 900)
      for (let k = 0; k < clumps; k++) {
        const side = k % 2, band = Math.floor(k / 2), bands = Math.ceil(clumps / 2)
        let [cx, cy] = randomZoneCell(rand, side)
        if (cx < 0) continue
        cy = Math.floor(((band + 0.15 + rand() * 0.7) / bands) * rows)
        if (cx < 0) continue
        const shade = 0.55 + rand() * 0.45
        const n = 2 + Math.floor(rand() * 4)
        for (let j = 0; j < n; j++) count += scatter(rand, shade, cx, cy, 5 + n)
      }
      for (let k = 0; k < singles; k++) {
        const [cx, cy] = randomZoneCell(rand, k % 2)
        if (cx >= 0) count += scatter(rand, 0.5 + rand() * 0.5, cx, cy, 2)
      }
      target = count
      if (still) shown.set(alive)
    }

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      cols = Math.ceil(w / PITCH); rows = Math.ceil(h / PITCH)
      canvas.width = w; canvas.height = h
      const n = cols * rows
      alive = new Uint8Array(n); next = new Uint8Array(n); age = new Uint8Array(n)
      zone = new Uint8Array(n); shown = new Float32Array(n); warmth = new Float32Array(n); tone = new Float32Array(n)
      const left = w / 2 - COLUMN - GAP, right = w / 2 + COLUMN + GAP
      active = left / PITCH >= MIN_MARGIN_CELLS
      for (let c = 0; c < cols; c++) {
        const x0 = c * PITCH, x1 = x0 + PITCH
        if (x1 > left && x0 < right) continue
        for (let r = 0; r < rows; r++) zone[idx(c, r)] = 1
      }
      seed(pageRef.current)
    }

    /** One generation of Life (B3/S23), confined to the margins. */
    const step = () => {
      let count = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = idx(c, r)
          if (!zone[i]) { next[i] = 0; continue }
          let n = 0
          for (let dy = -1; dy <= 1; dy++) {
            const rr = r + dy
            if (rr < 0 || rr >= rows) continue
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue
              const cc = c + dx
              if (cc >= 0 && cc < cols) n += alive[rr * cols + cc]
            }
          }
          const on = alive[i] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0
          next[i] = on
          // A newborn cell takes the shade of a live neighbour.
          if (on && !alive[i]) {
            for (let k = 0; k < 8; k++) {
              const cc = c + ((k % 3) - 1), rr = r + (Math.floor(k / 3) - 1)
              if (cc >= 0 && rr >= 0 && cc < cols && rr < rows && alive[rr * cols + cc]) { tone[i] = tone[rr * cols + cc]; break }
            }
          }
          age[i] = on ? (alive[i] ? Math.min(255, age[i] + 1) : 0) : 0
          count += on
        }
      }
      ;[alive, next] = [next, alive]
      // Keep the margins about as full as they started: new shapes where
      // old ones died, and a fresh start if a collision boils over.
      if (count > target * 2.5) seed(pageRef.current)
      else if (count < target * 0.75) scatter(Math.random, 0.55 + Math.random() * 0.45)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      if (!active) return
      const LEVELS = 6
      const inkPaths = Array.from({ length: LEVELS }, () => new Path2D())
      const warmPaths = Array.from({ length: LEVELS }, () => new Path2D())
      const used = new Uint8Array(LEVELS * 2)
      const off = (PITCH - DOT) / 2
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = idx(c, r)
          const v = shown[i]
          if (v < 0.03) continue
          // Newborn cells start lighter and darken as they settle.
          const settle = Math.min(1, 0.55 + age[i] * 0.15)
          const lv = Math.min(LEVELS - 1, Math.floor(v * settle * (tone[i] || 0.8) * LEVELS))
          const warm = warmth[i] > 0.15
          ;(warm ? warmPaths : inkPaths)[lv].rect(c * PITCH + off, r * PITCH + off, DOT, DOT)
          used[(warm ? LEVELS : 0) + lv] = 1
        }
      }
      for (let lv = 0; lv < LEVELS; lv++) {
        const a = ink.aMin + ((ink.aMax - ink.aMin) * (lv + 1)) / LEVELS
        if (used[lv]) { ctx.fillStyle = `rgb(${ink.rgb} / ${a.toFixed(3)})`; ctx.fill(inkPaths[lv]) }
        if (used[LEVELS + lv]) { ctx.fillStyle = `rgb(${ink.warm} / ${Math.min(1, a * 1.35).toFixed(3)})`; ctx.fill(warmPaths[lv]) }
      }
    }

    /** Ease pixels toward alive/dead; returns true while anything is still moving. */
    const fade = (dt: number) => {
      const k = 1 - Math.exp(-dt / FADE_MS)
      const cool = Math.exp(-dt / 1400)
      let moving = false
      for (let i = 0; i < shown.length; i++) {
        const t = alive[i], v = shown[i]
        if (v !== t) {
          const nv = v + (t - v) * k
          shown[i] = Math.abs(nv - t) < 0.01 ? t : nv
          moving = true
        }
        if (warmth[i] > 0.001) { warmth[i] *= cool; moving = true }
      }
      return moving
    }

    const busy = () => document.hidden || !!document.querySelector('.case-study')

    const frame = (now: number) => {
      raf = 0
      const dt = Math.min(64, now - (lastFrame || now - 16))
      lastFrame = now
      const moving = still ? (shown.set(alive), false) : fade(dt)
      draw()
      if (moving && !busy()) raf = requestAnimationFrame(frame)
      else lastFrame = 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }

    const tick = () => {
      timer = 0
      if (!busy() && active && !still) { step(); kick() }
      if (!still) timer = window.setTimeout(tick, GENERATION_MS)
    }

    onPage.current = id => {
      window.clearTimeout(seedTimer)
      if (still) { seed(id); kick(); return }
      alive.fill(0) // fade this page's pixels out, then bring in the next page's
      kick()
      seedTimer = window.setTimeout(() => { seed(id); kick() }, 260)
    }

    const onPointer = (e: PointerEvent) => {
      if (still || !active || e.pointerType !== 'mouse' || !fine.matches) return
      const c = Math.floor(e.clientX / PITCH), r = Math.floor(e.clientY / PITCH)
      if (c < 0 || r < 0 || c >= cols || r >= rows) return
      pointer.dx = e.clientX - pointer.x || pointer.dx; pointer.dy = e.clientY - pointer.y || pointer.dy
      pointer.x = e.clientX; pointer.y = e.clientY
      if (!zone[idx(c, r)]) return
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
        const cc = c + dx, rr = r + dy
        if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue
        const d = Math.hypot(dx, dy)
        if (d <= 3.2) { const i = idx(cc, rr); warmth[i] = Math.max(warmth[i], 1 - d / 4) }
      }
      // Now and then, release a glider heading the way the mouse moves.
      const now = performance.now()
      if (now - pointer.lastSpawn > 900) {
        const turn = pointer.dx >= 0 ? (pointer.dy >= 0 ? 0 : 3) : pointer.dy >= 0 ? 1 : 2
        const glider = orient(GLIDER, turn, false)
        if (free(glider, c - 1, r - 1, 1)) { place(glider, c - 1, r - 1, 0.9, 1); pointer.lastSpawn = now }
      }
      kick()
    }

    let resizeTimer = 0
    const onResize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { resize(); kick() }, 120) }
    const onVisible = () => { if (!document.hidden) kick() }
    const onMotion = () => {
      still = motion.matches
      window.clearTimeout(timer); timer = 0
      if (still) shown.set(alive)
      else timer = window.setTimeout(tick, GENERATION_MS)
      kick()
    }
    const themeWatch = new MutationObserver(() => {
      ink = INKS[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark']
      kick()
    })

    resize()
    kick()
    if (!still) timer = window.setTimeout(tick, GENERATION_MS)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisible)
    motion.addEventListener('change', onMotion)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer); window.clearTimeout(seedTimer); window.clearTimeout(resizeTimer)
      onPage.current = null
      themeWatch.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisible)
      motion.removeEventListener('change', onMotion)
    }
  }, [])

  return <canvas ref={ref} className="pixel-field" aria-hidden="true" />
}
