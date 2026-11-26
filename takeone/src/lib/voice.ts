import { getUi, pushLog, rt } from '../store'

let voice: SpeechSynthesisVoice | null = null

function pickVoice() {
  if (!('speechSynthesis' in window)) return null
  const all = window.speechSynthesis.getVoices()
  const pref = ['Google UK English Male', 'Daniel', 'Microsoft Ryan', 'Google US English', 'Alex', 'Samantha']
  for (const name of pref) {
    const v = all.find((x) => x.name.includes(name))
    if (v) return v
  }
  return all.find((v) => v.lang.startsWith('en')) ?? null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => (voice = pickVoice())
}

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

/** TakeOne says a line: it goes in the log, pulses the speaker, and is spoken if voice is on. */
export function say(text: string) {
  pushLog('to', text)
  rt.speaking = 1
  if (!getUi().voice || !canSpeak) return
  const u = new SpeechSynthesisUtterance(text)
  voice = voice ?? pickVoice()
  if (voice) u.voice = voice
  u.rate = 1.04
  u.pitch = 0.95
  const pulse = window.setInterval(() => (rt.speaking = 1), 250)
  u.onend = u.onerror = () => window.clearInterval(pulse)
  window.speechSynthesis.speak(u)
}

export function hush() {
  if (canSpeak) window.speechSynthesis.cancel()
}
