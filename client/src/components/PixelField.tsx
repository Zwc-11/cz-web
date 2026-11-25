import { useEffect, useRef } from 'react'

/**
 * Pixel icons down both margins: small drawings of what the site is about.
 * Film camera and robot arm (TakeOne), robot head (FRC, VEX), charts and
 * candlesticks (markets), chip, terminal and code (AI and software),
 * trophy (hackathons), maple leaf (Toronto), pendant lamp (the site's lamp
 * light), coffee, gear, database, a sprout and a flame (the seal's 木 and
 * 火), with small sparkles and pixel crumbs between them.
 *
 * The arrangement is fixed: the same on every tab and on every visit for a
 * given window size, and never behind the text column. A few icons idle
 * (the camera's record light, the terminal cursor, the flame, the coffee
 * steam, the robot blinking); hovering wakes the others (the lamp
 * brightens, the robot smiles, the arm grips, the chip powers up).
 *
 * One canvas at 1×, scaled with image-rendering: pixelated. Only a glyph
 * whose pixels change is redrawn, inside its own box. Hidden when the window has no margins (phones);
 * no idle animation under reduced motion.
 */

const PITCH = 7 // CSS px per cell
const DOT = 6 // CSS px square (1 px gap)
const COLUMN = 360 // half the content column
const GAP = 40 // clear space between the column and the first pixels
const MIN_MARGIN_CELLS = 6
const FADE_MS = 70
const SEED = 20260111

type Glyph = { rows: string[]; alt?: string[]; hover?: string[]; on?: number; off?: number }

// '#' ink, 'o' accent, '.' empty. alt: the idle frame (shown `on` ms out
// of every `on + off`), and the hover frame when no hover frame is given.
const ICONS: Record<string, Glyph> = {
  camera: {
    rows: ['.##...##...', '#..#.#..#..', '#..#.#..#..', '.##...##...', '########...', '#......#..#', '#.o....####', '#......####', '#......#..#', '########...'],
    alt: ['.##...##...', '#..#.#..#..', '#..#.#..#..', '.##...##...', '########...', '#......#..#', '#......####', '#......####', '#......#..#', '########...'],
    hover: ['.##...##...', '#..#.#..#..', '#..#.#..#..', '.##...##...', '########...', '#......#..#', '#.o....####', '#......####', '#......#..#', '########...'],
    on: 900, off: 1100,
  },
  robot: {
    rows: ['....o....', '....#....', '.#######.', '#.......#', '#.##.##.#', '#.##.##.#', '#.......#', '#..###..#', '.#######.', '..#...#..'],
    alt: ['....o....', '....#....', '.#######.', '#.......#', '#.......#', '#.##.##.#', '#.......#', '#..###..#', '.#######.', '..#...#..'],
    hover: ['....o....', '....#....', '.#######.', '#.......#', '#.##.##.#', '#.##.##.#', '#.#...#.#', '#..###..#', '.#######.', '..#...#..'],
    on: 170, off: 3600,
  },
  arm: {
    rows: ['......#.#..', '......#.#..', '.......#...', '......#....', '.....#.....', '..###......', '..#o#......', '..###......', '...#.......', '...#.......', '.#####.....', '#######....'],
    hover: ['......#o#..', '......###..', '.......#...', '......#....', '.....#.....', '..###......', '..#o#......', '..###......', '...#.......', '...#.......', '.#####.....', '#######....'],
  },
  chart: { rows: ['#.........o', '#........#.', '#....#..#..', '#...#.##...', '#..#.......', '#.#........', '#..........', '###########'] },
  candles: { rows: ['.......#.', '.......#.', '.#....###', '.#....###', '###...###', '###....#.', '###.o....', '.#.ooo...', '...ooo...', '....o....'] },
  chip: {
    rows: ['..#.#.#..', '.#######.', '##.....##', '.#.###.#.', '##.#.#.##', '.#.###.#.', '##.....##', '.#######.', '..#.#.#..'],
    hover: ['..o.o.o..', '.#######.', 'o#.....#o', '.#.###.#.', 'o#.#o#.#o', '.#.###.#.', 'o#.....#o', '.#######.', '..o.o.o..'],
  },
  terminal: {
    rows: ['###########', '#.........#', '#.#.......#', '#..#......#', '#.#..ooo..#', '#.........#', '###########'],
    alt: ['###########', '#.........#', '#.#.......#', '#..#......#', '#.#.......#', '#.........#', '###########'],
    on: 560, off: 640,
  },
  code: { rows: ['......#....', '..#...#.#..', '.#...#...#.', '#....#....#', '.#..#....#.', '..#.#...#..', '....#......'] },
  trophy: {
    rows: ['#########', '#.#####.#', '#.#####.#', '.#.###.#.', '...###...', '....#....', '....#....', '..#####..'],
    hover: ['#########', '#.##o##.#', '#.#####.#', '.#.###.#.', '...###...', '....#....', '....#....', '..#####..'],
  },
  maple: { rows: ['....#....', '...###...', '#..###..#', '##.###.##', '#########', '.#######.', '..#####..', '.#..#..#.', '....#....'] },
  lamp: {
    rows: ['....#....', '....#....', '....#....', '...###...', '..#####..', '.#######.', '....o....', '..o.o.o..', '.o..o..o.'],
    hover: ['....#....', '....#....', '....#....', '...###...', '..#####..', '.#######.', '...ooo...', '.o..o..o.', 'o...o...o'],
  },
  coffee: {
    rows: ['.#...#...', '..#...#..', '.#...#...', '.........', '#######..', '#.....###', '#.....#.#', '#.....###', '.#####...'],
    alt: ['..#...#..', '.#...#...', '..#...#..', '.........', '#######..', '#.....###', '#.....#.#', '#.....###', '.#####...'],
    on: 900, off: 900,
  },
  gear: { rows: ['...###...', '.#.###.#.', '.#######.', '###...###', '###...###', '###...###', '.#######.', '.#.###.#.', '...###...'] },
  database: {
    rows: ['.#######.', '#.......#', '.#######.', '#.......#', '.#######.', '#.......#', '.#######.'],
    hover: ['.#######.', '#.o.....#', '.#######.', '#.o.....#', '.#######.', '#.o.....#', '.#######.'],
  },
  sprout: { rows: ['......##.', '.##..####', '####.###.', '.###.#...', '...##....', '....#....', '..#####..', '..#####..', '...###...'] },
  flame: {
    rows: ['....#....', '...##....', '...###...', '..####.#.', '.#######.', '.###o###.', '.##ooo##.', '..#ooo#..', '...###...'],
    alt: ['...#.....', '...##....', '..###....', '..####.#.', '.#######.', '.###o###.', '.##ooo##.', '..#ooo#..', '...###...'],
    on: 520, off: 780,
  },
}
// The order icons are placed in; smaller windows show the first ones.
const ICON_ORDER = ['camera', 'robot', 'arm', 'chart', 'terminal', 'chip', 'lamp', 'trophy', 'candles', 'flame', 'code', 'coffee', 'maple', 'gear', 'database', 'sprout'] as const

const SPARKLE: Glyph = { rows: ['..#..', '..#..', '##o##', '..#..', '..#..'], alt: ['.....', '..#..', '.#o#.', '..#..', '.....'], on: 600, off: 3400 }
const CRUMBS: Glyph[] = [
  { rows: ['##'] }, { rows: ['##', '##'] }, { rows: ['.#.', '###', '.#.'] }, { rows: ['#..', '.#.', '..#'] },
  { rows: ['#.', '##'] }, { rows: ['#.#'] }, { rows: ['#', '.', '#'] },
]

type Ink = { ink: string; accent: string; aInk: number; aAccent: number }
const INKS: Record<'dark' | 'light', Ink> = {
  dark: { ink: '236 218 194', accent: '242 150 112', aInk: 0.34, aAccent: 0.62 },
  light: { ink: '62 48 38', accent: '164 65 39', aInk: 0.6, aAccent: 0.78 },
}

type Placed = { g: Glyph; icon: boolean; c: number; r: number; w: number; h: number; phase: number; frame: string[]; dirty: boolean; snap: boolean }

const widthOf = (g: Glyph) => Math.max(...g.rows.map(l => l.length))

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

export function PixelField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    let still = motion.matches
    let ink = INKS[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark']

    let w = 0, h = 0, cols = 0, rows = 0, active = false
    let placed: Placed[] = []
    // Per cell: what should show (0 none, 1 ink, 2 accent), how much ink and
    // accent is showing now, the pointer's warmth, and the glyph's shade.
    let want = new Uint8Array(0), inkV = new Float32Array(0), accV = new Float32Array(0), warm = new Float32Array(0), tone = new Float32Array(0)
    let leftEnd = 0, rightStart = 0
    let hovered = -1
    let raf = 0, timer = 0, lastFrame = 0
    const start = performance.now()

    const idx = (c: number, r: number) => r * cols + c
    const LEVELS = 5
    const inkPaths: Path2D[] = [], accPaths: Path2D[] = []
    const usedInk = new Uint8Array(LEVELS), usedAcc = new Uint8Array(LEVELS)

    /** Write a placed glyph's current frame into `want`. */
    const paint = (p: Placed) => {
      for (let y = 0; y < p.h; y++) {
        const line = p.frame[y] ?? ''
        for (let x = 0; x < p.w; x++) {
          const ch = line[x]
          want[idx(p.c + x, p.r + y)] = ch === '#' ? 1 : ch === 'o' ? 2 : 0
        }
      }
    }
    const frameFor = (p: Placed, i: number, now: number) => {
      const g = p.g
      if (i === hovered && (g.hover || g.alt)) return g.hover ?? g.alt!
      if (!still && g.alt && g.on && g.off && (now - start + p.phase) % (g.on + g.off) < g.on) return g.alt
      return g.rows
    }
    /** Bring every glyph to the frame it should show now; true if any changed. */
    const update = (now: number) => {
      let changed = false
      placed.forEach((p, i) => {
        const f = frameFor(p, i, now)
        // Frame flips are instant, like pixel art; only the first
        // appearance fades in.
        if (f !== p.frame) { if (p.frame.length) p.snap = true; p.frame = f; paint(p); changed = true }
      })
      return changed
    }

    const layout = () => {
      w = window.innerWidth; h = window.innerHeight
      cols = Math.ceil(w / PITCH); rows = Math.ceil(h / PITCH)
      canvas.width = w; canvas.height = h
      const n = cols * rows
      want = new Uint8Array(n); inkV = new Float32Array(n); accV = new Float32Array(n); warm = new Float32Array(n); tone = new Float32Array(n)
      leftEnd = Math.floor((w / 2 - COLUMN - GAP) / PITCH)
      rightStart = Math.ceil((w / 2 + COLUMN + GAP) / PITCH)
      placed = []
      hovered = -1
      active = leftEnd >= MIN_MARGIN_CELLS
      if (!active) return

      // Seeded by the window size only, so every tab and every visit at
      // this size gets the same picture.
      const rand = rng(SEED + cols * 977 + rows)
      const taken = new Uint8Array(n)
      const sideRange = (side: number): [number, number] => (side === 0 ? [1, leftEnd] : [rightStart, cols - 1])
      const fits = (g: Glyph, c: number, r: number, side: number, pad: number) => {
        const gw = widthOf(g), gh = g.rows.length
        const [c0, c1] = sideRange(side)
        if (c < c0 || c + gw > c1 || r < 1 || r + gh > rows - 1) return false
        for (let y = r - pad; y < r + gh + pad; y++) for (let x = c - pad; x < c + gw + pad; x++) {
          if (x >= 0 && y >= 0 && x < cols && y < rows && taken[idx(x, y)]) return false
        }
        return true
      }
      const put = (g: Glyph, icon: boolean, c: number, r: number, shade: number) => {
        const p: Placed = { g, icon, c, r, w: widthOf(g), h: g.rows.length, phase: rand() * 4000, frame: [], dirty: true, snap: false }
        for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { taken[idx(c + x, r + y)] = 1; tone[idx(c + x, r + y)] = shade }
        placed.push(p)
      }

      // Icons alternate sides and work down each margin in bands, so both
      // sides fill evenly from top to bottom.
      const bands = Math.max(2, Math.floor(rows / 16))
      const count = Math.min(ICON_ORDER.length, bands * 2)
      for (let k = 0; k < count; k++) {
        const g = ICONS[ICON_ORDER[k]]
        const side = k % 2, band = Math.floor(k / 2)
        const [c0, c1] = sideRange(side)
        const span = Math.max(1, c1 - c0 - widthOf(g))
        for (let tries = 0; tries < 40; tries++) {
          const c = c0 + Math.floor(rand() * span)
          const r = 1 + Math.floor(((band + 0.1 + rand() * 0.8) / bands) * (rows - g.rows.length - 2))
          if (fits(g, c, r, side, 3)) { put(g, true, c, r, 0.82 + rand() * 0.18); break }
        }
      }
      // Sparkles and crumbs in the gaps, lighter than the icons.
      const marginCells = (leftEnd + cols - rightStart) * rows
      // Capped, so very wide screens get more air rather than more crumbs.
      const crumbs = Math.min(44, Math.round(marginCells / 380))
      for (let k = 0; k < crumbs; k++) {
        const g = rand() < 0.16 ? SPARKLE : CRUMBS[Math.floor(rand() * CRUMBS.length)]
        const side = k % 2
        const [c0, c1] = sideRange(side)
        for (let tries = 0; tries < 20; tries++) {
          const c = c0 + Math.floor(rand() * Math.max(1, c1 - c0 - widthOf(g)))
          const r = 1 + Math.floor(rand() * (rows - g.rows.length - 2))
          if (fits(g, c, r, side, 2)) { put(g, false, c, r, 0.5 + rand() * 0.35); break }
        }
      }
      update(performance.now())
    }

    /** Draw one glyph into its own box (glyphs never overlap). */
    const drawGlyph = (p: Placed) => {
      ctx.clearRect(p.c * PITCH, p.r * PITCH, p.w * PITCH, p.h * PITCH)
      const off = (PITCH - DOT) / 2
      for (let lv = 0; lv < LEVELS; lv++) { inkPaths[lv] = new Path2D(); accPaths[lv] = new Path2D(); usedInk[lv] = 0; usedAcc[lv] = 0 }
      for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
        const c = p.c + x, r = p.r + y, i = idx(c, r)
        for (const [v, accent] of [[inkV[i], warm[i] > 0.2], [accV[i], true]] as const) {
          if (v <= 0.03) continue
          const lv = Math.min(LEVELS - 1, Math.floor(v * tone[i] * LEVELS))
          ;(accent ? accPaths : inkPaths)[lv].rect(c * PITCH + off, r * PITCH + off, DOT, DOT)
          ;(accent ? usedAcc : usedInk)[lv] = 1
        }
      }
      for (let lv = 0; lv < LEVELS; lv++) {
        const k = (lv + 1) / LEVELS
        if (usedInk[lv]) { ctx.fillStyle = `rgb(${ink.ink} / ${(ink.aInk * k).toFixed(3)})`; ctx.fill(inkPaths[lv]) }
        if (usedAcc[lv]) { ctx.fillStyle = `rgb(${ink.accent} / ${(ink.aAccent * k).toFixed(3)})`; ctx.fill(accPaths[lv]) }
      }
    }

    /** Ease one glyph's pixels toward its frame; true if anything changed. */
    const fadeGlyph = (p: Placed, k: number, cool: number) => {
      let changed = false
      for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
        const i = idx(p.c + x, p.r + y)
        const ti = want[i] === 1 ? 1 : 0, ta = want[i] === 2 ? 1 : 0
        if (inkV[i] !== ti) { const v = inkV[i] + (ti - inkV[i]) * k; inkV[i] = Math.abs(v - ti) < 0.04 ? ti : v; changed = true }
        if (accV[i] !== ta) { const v = accV[i] + (ta - accV[i]) * k; accV[i] = Math.abs(v - ta) < 0.04 ? ta : v; changed = true }
        if (warm[i] > 0.01) { warm[i] *= cool; changed = true } else if (warm[i]) { warm[i] = 0; changed = true }
      }
      return changed
    }

    const busy = () => document.hidden || !!document.querySelector('.case-study')

    // Only glyphs whose pixels changed are redrawn, each in its own box;
    // `full` repaints everything (first draw, theme, resize).
    let full = true
    const frame = (now: number) => {
      raf = 0
      const dt = Math.min(64, now - (lastFrame || now - 16))
      lastFrame = now
      const k = still ? 1 : 1 - Math.exp(-dt / FADE_MS), cool = Math.exp(-dt / 900)
      if (full) { ctx.clearRect(0, 0, w, h); full = false }
      let moving = false
      for (const p of placed) {
        if (fadeGlyph(p, p.snap ? 1 : k, cool) || p.dirty) { drawGlyph(p); p.dirty = false; moving = true }
        p.snap = false
      }
      if (moving && !busy()) raf = requestAnimationFrame(frame)
      else lastFrame = 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }

    // Idle frames: a few times a second, flip any glyph that is due.
    const tick = () => {
      timer = 0
      if (!busy() && active && update(performance.now())) kick()
      if (!still) timer = window.setTimeout(tick, 100)
    }

    const onPointer = (e: PointerEvent) => {
      if (!active || e.pointerType !== 'mouse' || !fine.matches) return
      const c = Math.floor(e.clientX / PITCH), r = Math.floor(e.clientY / PITCH)
      let over = -1
      if (c < leftEnd || c >= rightStart) {
        over = placed.findIndex(p => p.icon && c >= p.c - 1 && c <= p.c + p.w && r >= p.r - 1 && r <= p.r + p.h)
        if (!still) {
          for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
            const cc = c + dx, rr = r + dy, d = Math.hypot(dx, dy)
            if (d > 3.2 || cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue
            const i = idx(cc, rr)
            if (want[i]) warm[i] = Math.max(warm[i], 1 - d / 4)
          }
        }
      }
      if (over !== hovered) { hovered = over; update(performance.now()) }
      kick()
    }
    const onLeave = () => { if (hovered !== -1) { hovered = -1; update(performance.now()); kick() } }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        layout()
        // A resize redraws in place rather than fading everything in again.
        for (let i = 0; i < want.length; i++) { inkV[i] = want[i] === 1 ? 1 : 0; accV[i] = want[i] === 2 ? 1 : 0 }
        full = true
        kick()
      }, 120)
    }
    const onVisible = () => { if (!document.hidden) kick() }
    const onMotion = () => {
      still = motion.matches
      window.clearTimeout(timer); timer = 0
      update(performance.now())
      if (!still) timer = window.setTimeout(tick, 100)
      kick()
    }
    const themeWatch = new MutationObserver(() => {
      ink = INKS[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark']
      full = true
      for (const p of placed) p.dirty = true
      kick()
    })

    layout()
    kick()
    if (!still) timer = window.setTimeout(tick, 100)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisible)
    motion.addEventListener('change', onMotion)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer); window.clearTimeout(resizeTimer)
      themeWatch.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisible)
      motion.removeEventListener('change', onMotion)
    }
  }, [])

  return <canvas ref={ref} className="pixel-field" aria-hidden="true" />
}
