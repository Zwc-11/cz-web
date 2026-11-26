// Two kinds of state.
// `rt` is mutable per-frame state read inside the render loop (scroll, pointer,
// the take being played). Writing to it never re-renders React.
// `ui` is the small immutable snapshot React components subscribe to.

import { useSyncExternalStore } from 'react'
import type { TemplateId } from './three/templates'

export type Phase = 'idle' | 'thinking' | 'reposition' | 'rolling' | 'cut'

export interface TakePlayback {
  id: number
  template: TemplateId
  duration: number
  phase: Phase
  phaseStart: number // seconds, rt.time
  from?: { x: number; z: number; yaw: number }
}

export const rt = {
  time: 0,
  scrollY: 0,
  vw: 1,
  vh: 1,
  // continuous shot coordinate: section index + progress
  s: 0,
  shot: 0,
  f: 0,
  blend: 0,
  pointer: { x: 0, y: 0 },
  lit: 0,
  introStart: -1,
  reduced: false,
  mobile: false,
  monitorEl: null as HTMLElement | null,
  labelEls: [] as (HTMLElement | null)[],
  take: null as TakePlayback | null,
  warm: new Set<string>(),
  speaking: 0,
  captureJobs: [] as CaptureJob[],
  sceneReady: false,
  monitorClock: null as HTMLElement | null,
  monitorLens: null as HTMLElement | null,
  hudClock: null as HTMLElement | null,
  explode: 0,
  rigEl: null as HTMLElement | null,
}

// Take lifecycle events from the frame loop to the console: 'rolling', 'cut', 'done', 'thumb'
export const bus = new EventTarget()

export interface CaptureJob {
  kind: 'pov' | 'seed'
  seed?: { pos: [number, number, number]; look: [number, number, number]; fov: number }
  done: (url: string) => void
}

export interface Take {
  id: number
  template: TemplateId
  duration: number
  thumb: string | null
  mine: boolean
}

export type LogKind = 'you' | 'to' | 'call' | 'sys' | 'err' | 'muted'
export interface LogLine {
  id: number
  kind: LogKind
  text: string
}

export interface Budget {
  toolCall: number
  compile: number
  cold: boolean
  preflight: number
  reply: number
}

export interface UiState {
  shot: number
  dark: boolean
  introDone: boolean
  rolling: boolean
  busy: boolean
  voice: boolean
  takes: Take[]
  log: LogLine[]
  budget: Budget | null
  takeClock: number
}

let ui: UiState = {
  shot: 0,
  dark: true,
  introDone: false,
  rolling: false,
  busy: false,
  voice: false,
  takes: [],
  log: [],
  budget: null,
  takeClock: 0,
}

const listeners = new Set<() => void>()

export function setUi(patch: Partial<UiState> | ((s: UiState) => Partial<UiState>)) {
  const p = typeof patch === 'function' ? patch(ui) : patch
  let changed = false
  for (const k in p) {
    if ((p as Record<string, unknown>)[k] !== (ui as unknown as Record<string, unknown>)[k]) {
      changed = true
      break
    }
  }
  if (!changed) return
  ui = { ...ui, ...p }
  listeners.forEach((l) => l())
}

export function getUi() {
  return ui
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useUi<T>(sel: (s: UiState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => sel(ui),
    () => sel(ui),
  )
}

let lineId = 0
export function pushLog(kind: LogKind, text: string) {
  setUi((s) => ({ log: [...s.log.slice(-40), { id: ++lineId, kind, text }] }))
}
