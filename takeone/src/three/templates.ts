// Camera moves the rig can perform on this page. Each one is a pure function of
// normalised take time u in [0, 1] -> where the cart is, where the phone looks,
// how far the arm lifts and the phone's field of view. The subject's mark is
// the origin; the rig starts on +z facing it.

export type TemplateId =
  | 'push_in'
  | 'pull_out'
  | 'orbit'
  | 'crane_reveal'
  | 'tilt_up'
  | 'track_follow'
  | 'dolly_zoom'

export interface TakeFrame {
  cart: [number, number]
  yaw: number | null // null = face the subject
  lift: number // -1 low .. 1 high
  aim: [number, number, number]
  fov: number // vertical, degrees
  subject: [number, number]
  walking: boolean
}

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const FACE_Y = 1.58

export function templateFrame(id: TemplateId, u: number): TakeFrame {
  const e = ease(Math.min(1, Math.max(0, u)))
  const base: TakeFrame = {
    cart: [0, 2.3],
    yaw: null,
    lift: 0,
    aim: [0, FACE_Y, 0],
    fov: 40,
    subject: [0, 0],
    walking: false,
  }
  switch (id) {
    case 'push_in':
      return { ...base, cart: [0, lerp(2.6, 1.3, e)], fov: 38 }
    case 'pull_out':
      return { ...base, cart: [0, lerp(1.3, 3.3, e)], fov: 40, aim: [0, lerp(1.58, 1.2, e), 0] }
    case 'orbit': {
      const a = lerp(-0.95, 0.95, easeSine(u))
      const r = 1.9
      return { ...base, cart: [Math.sin(a) * r, Math.cos(a) * r], aim: [0, 1.38, 0], fov: 40 }
    }
    case 'crane_reveal':
      return { ...base, cart: [0, 2.15], lift: lerp(-1, 1, e), aim: [0, lerp(1.05, 1.6, e), 0], fov: 42 }
    case 'tilt_up':
      return { ...base, cart: [0, 1.75], lift: 0.1, aim: [0, lerp(0.08, 1.6, e), 0], fov: 36 }
    case 'track_follow': {
      const x = lerp(-1.5, 1.5, u)
      return {
        ...base,
        cart: [x + 0.15, 1.85],
        yaw: Math.PI / 2,
        subject: [x, 0],
        walking: u > 0.02 && u < 0.98,
        aim: [x, 1.45, 0],
        fov: 42,
      }
    }
    case 'dolly_zoom': {
      // keep the subject the same size: frame height = 2 d tan(fov / 2)
      const d0 = 1.35
      const d = lerp(d0, 3.1, e)
      const f0 = (56 * Math.PI) / 180
      const fov = (2 * Math.atan((Math.tan(f0 / 2) * d0) / d) * 180) / Math.PI
      return { ...base, cart: [0, d], fov, aim: [0, 1.5, 0] }
    }
  }
}

export interface TemplateInfo {
  id: TemplateId
  label: string
  phrase: (d: number) => string
  reply: (d: number) => string
  defaultDuration: number
}

const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
export const spell = (n: number) => {
  const w = words[Math.round(n)] ?? String(Math.round(n))
  return w.charAt(0).toUpperCase() + w.slice(1)
}

export const TEMPLATES: Record<TemplateId, TemplateInfo> = {
  push_in: {
    id: 'push_in',
    label: 'Push in',
    defaultDuration: 5,
    phrase: (d) => `Give me a ${words[d] ?? d}-second push-in.`,
    reply: (d) => `${spell(d)} seconds, pushing in from 2.6 metres to 1.3. Ready when you are.`,
  },
  pull_out: {
    id: 'pull_out',
    label: 'Pull out',
    defaultDuration: 6,
    phrase: (d) => `Pull out to a wide over ${d} seconds.`,
    reply: (d) => `${spell(d)} seconds, pulling back to 3.3 metres for the wide.`,
  },
  orbit: {
    id: 'orbit',
    label: 'Slow orbit',
    defaultDuration: 8,
    phrase: (d) => `Slow orbit around me, ${d} seconds.`,
    reply: (d) => `${spell(d)} seconds, circling 110 degrees around you at 1.9 metres. Keep facing the phone.`,
  },
  crane_reveal: {
    id: 'crane_reveal',
    label: 'Crane reveal',
    defaultDuration: 6,
    phrase: (d) => `Crane up and reveal me, ${d} seconds.`,
    reply: (d) => `${spell(d)} seconds, rising from chest height to just above your eye line.`,
  },
  tilt_up: {
    id: 'tilt_up',
    label: 'Tilt up',
    defaultDuration: 5,
    phrase: (d) => `Tilt up from my shoes, ${d} seconds.`,
    reply: (d) => `${spell(d)} seconds, tilting from your shoes up to your eyes. Hold still for me.`,
  },
  track_follow: {
    id: 'track_follow',
    label: 'Follow me',
    defaultDuration: 7,
    phrase: () => `Follow me as I walk across.`,
    reply: (d) => `Walk to your left when we roll. I'll track beside you at 1.85 metres for ${d} seconds.`,
  },
  dolly_zoom: {
    id: 'dolly_zoom',
    label: 'Dolly zoom',
    defaultDuration: 6,
    phrase: (d) => `Can you do a dolly zoom? ${d} seconds.`,
    reply: (d) =>
      `${spell(d)} seconds of dolly zoom. I'll back away while the lens tightens, so you stay the same size and the set stretches behind you.`,
  },
}

export const CHIPS: TemplateId[] = ['push_in', 'orbit', 'crane_reveal', 'track_follow', 'dolly_zoom', 'tilt_up']

// ---- natural-language direction -> template + duration ----

const numberWords: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30,
}

export const MIN_S = 3
export const MAX_S = 12

export interface Parsed {
  template: TemplateId
  duration: number
  requested: number | null
}

export function parseDirection(raw: string): Parsed | null {
  const t = raw.toLowerCase()
  const rules: [TemplateId, RegExp][] = [
    ['dolly_zoom', /dolly[\s-]*zoom|vertigo|zolly|hitchcock|contra[\s-]*zoom/],
    ['track_follow', /follow|track|walk|tracking/],
    ['orbit', /orbit|circle|around me|around her|around him|360|arc/],
    ['crane_reveal', /crane|boom|rise|rising|jib|reveal/],
    ['tilt_up', /tilt/],
    ['pull_out', /pull[\s-]*(out|back)|wider|go wide|dolly out|back up|move back/],
    ['push_in', /push|closer|move in|dolly in|close[\s-]*up|tighter|zoom in/],
  ]
  const hit = rules.find(([, re]) => re.test(t))
  if (!hit) return null
  const template = hit[0]
  let requested: number | null = null
  const num = t.match(/(\d+(?:\.\d+)?)\s*(?:-\s*)?(?:s\b|sec|secs|second|seconds)/)
  if (num) requested = parseFloat(num[1])
  else {
    const w = t.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty)[\s-]*(?:s\b|sec|second)/)
    if (w) requested = numberWords[w[1]]
  }
  let duration = requested ?? TEMPLATES[template].defaultDuration
  if (requested == null) {
    if (/\bslow|gentle|lazy/.test(t)) duration += 3
    if (/\bfast|quick|snap/.test(t)) duration -= 2
  }
  duration = Math.round(Math.min(MAX_S, Math.max(MIN_S, duration)))
  return { template, duration, requested }
}
