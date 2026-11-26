// The website's own camera work. Each page section is a shot, and each shot is
// one of TakeOne's camera moves performed on the virtual set.

export type V3 = [number, number, number]
export interface Pose {
  pos: V3
  target: V3
  fov: number
  offset: number // horizontal framing shift as a fraction of viewport width
  offsetY?: number // vertical shift, + moves the scene down
}

export const SHOTS = [
  { id: 'hero', title: 'Start', move: 'crane_reveal' },
  { id: 'talk', title: 'Talk', move: 'push_in' },
  { id: 'rehearse', title: 'Rehearse', move: 'orbit' },
  { id: 'direct', title: 'Direct', move: 'locked_off' },
  { id: 'edit', title: 'Edit', move: 'top_shot' },
  { id: 'rig', title: 'Rig', move: 'orbit' },
  { id: 'wrap', title: 'Wrap', move: 'pull_out' },
] as const

// where the cart parks for its close-up, away from the set
export const RIG_SPOT: [number, number] = [3.0, 4.2]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lv = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
export const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
const inout = (t: number) => -(Math.cos(Math.PI * Math.min(1, Math.max(0, t))) - 1) / 2

function orbit(c: V3, r: number, a: number, y: number): V3 {
  return [c[0] + Math.sin(a) * r, y, c[2] + Math.cos(a) * r]
}

export function shotPose(i: number, f: number, mobile: boolean): Pose {
  const p = desktopOrMobile(i, f, mobile)
  // on phones the copy sits in the lower half, so the set is lifted into the upper half
  if (mobile && i !== 3 && i !== 4) {
    p.offsetY = -0.24
    const k = i === 6 ? 1.1 : 1.45
    p.pos = [p.target[0] + (p.pos[0] - p.target[0]) * k, p.target[1] + (p.pos[1] - p.target[1]) * k, p.target[2] + (p.pos[2] - p.target[2]) * k]
  }
  return p
}

function desktopOrMobile(i: number, f: number, mobile: boolean): Pose {
  const side = mobile ? 0 : 0.2
  const e = inout(f)
  switch (i) {
    case 0: // crane reveal from behind the cart toward the performer on the mark
      return {
        pos: lv([2.7, 1.25, 6.9], [3.1, 2.7, 7.4], e),
        target: lv([-0.35, 1.2, 0.9], [-0.3, 0.9, 0.9], e),
        fov: mobile ? 46 : 32,
        offset: side * 0.95,
      }
    case 1: // over the performer's shoulder, pushing in on the rig
      return {
        pos: lv([1.05, 1.55, -0.6], [0.45, 1.8, 0.3], e),
        target: lv([0.05, 1.5, 2.3], [0.02, 1.86, 2.3], e),
        fov: mobile ? 52 : lerp(40, 34, e),
        offset: side * 1.05,
      }
    case 2: // high orbit while the stage turns into the simulator
      return {
        pos: orbit([0, 0.6, 1.1], 5.7, lerp(0.45, 1.55, e), lerp(3.7, 4.6, e)),
        target: [0, 0.55, 1.05],
        fov: mobile ? 50 : 36,
        offset: side,
      }
    case 3: // locked off: the stage beside the console
      return {
        pos: [6.1, 3.7, 8.4],
        target: [0.1, 0.85, 1.1],
        fov: mobile ? 50 : 28,
        offset: mobile ? 0 : 0.27,
        offsetY: mobile ? 0 : 0.27,
      }
    case 4: // top shot over the set
      return {
        pos: lv([0.7, 12.5, 2.7], [0.6, 13.2, 2.2], e),
        target: [0.3, 0, 0.8],
        fov: mobile ? 46 : 30,
        offset: mobile ? 0 : 0.25,
        offsetY: mobile ? 0 : 0.3,
      }
    case 5: // close orbit around the rig while it comes apart
      return {
        pos: orbit([RIG_SPOT[0], 1.2, RIG_SPOT[1]], 4.2, lerp(3.55, 4.55, e), lerp(1.55, 1.95, e)),
        target: [RIG_SPOT[0], 1.02, RIG_SPOT[1]],
        fov: mobile ? 56 : 38,
        offset: side,
      }
    default: // pull out as the lights go down
      return {
        pos: lv([3.4, 1.9, 6.6], [2.2, 5.6, 12.5], e),
        target: lv([0, 1.05, 1.1], [0, 0.6, 1.1], e),
        fov: mobile ? 50 : 34,
        offset: mobile ? 0 : 0.26,
      }
  }
}

export function blendPose(a: Pose, b: Pose, t: number): Pose {
  const k = inout(t)
  return {
    pos: lv(a.pos, b.pos, k),
    target: lv(a.target, b.target, k),
    fov: lerp(a.fov, b.fov, k),
    offset: lerp(a.offset, b.offset, k),
    offsetY: lerp(a.offsetY ?? 0, b.offsetY ?? 0, k),
  }
}
