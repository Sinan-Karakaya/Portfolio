'use client'

// Interface sounds, synthesised on the fly with WebAudio — no audio files to load.
// Off by default; the choice is remembered per browser.

export type Sound = 'tick' | 'blip' | 'select' | 'toggle' | 'whoosh' | 'confirm' | 'error' | 'thump'

const KEY = 'sk:sfx'
let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled: boolean | null = null
let lastTick = 0
const listeners = new Set<(on: boolean) => void>()

function read(): boolean {
  if (enabled === null) {
    try {
      enabled = localStorage.getItem(KEY) === '1'
    } catch {
      enabled = false
    }
  }
  return enabled
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone(type: OscillatorType, from: number, to: number, start: number, dur: number, gain: number) {
  const a = audio()
  if (!a || !master) return
  const t = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function noise(dur: number, fromHz: number, toHz: number, gain: number) {
  const a = audio()
  if (!a || !master) return
  const t = a.currentTime
  const buffer = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = a.createBufferSource()
  src.buffer = buffer
  const filter = a.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 1.4
  filter.frequency.setValueAtTime(fromHz, t)
  filter.frequency.exponentialRampToValueAtTime(toHz, t + dur)
  const g = a.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter).connect(g).connect(master)
  src.start(t)
}

const VOICES: Record<Sound, () => void> = {
  tick: () => tone('sine', 2200, 1800, 0, 0.035, 0.035),
  blip: () => tone('square', 880, 1320, 0, 0.045, 0.018),
  select: () => tone('triangle', 520, 1040, 0, 0.08, 0.07),
  toggle: () => {
    tone('square', 660, 660, 0, 0.04, 0.02)
    tone('square', 990, 990, 0.05, 0.05, 0.02)
  },
  whoosh: () => noise(0.32, 380, 2600, 0.09),
  confirm: () => {
    tone('triangle', 660, 660, 0, 0.07, 0.05)
    tone('triangle', 880, 880, 0.07, 0.07, 0.05)
    tone('triangle', 1320, 1320, 0.14, 0.12, 0.05)
  },
  error: () => tone('sawtooth', 220, 110, 0, 0.22, 0.04),
  thump: () => {
    tone('sine', 90, 40, 0, 0.28, 0.16)
    noise(0.06, 3000, 1200, 0.03)
  },
}

export const sfx = {
  isEnabled: read,
  set(on: boolean) {
    enabled = on
    try {
      localStorage.setItem(KEY, on ? '1' : '0')
    } catch {}
    listeners.forEach((fn) => fn(on))
    if (on) VOICES.toggle()
  },
  subscribe(fn: (on: boolean) => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
  play(sound: Sound) {
    if (!read()) return
    if (sound === 'tick') {
      const now = performance.now()
      if (now - lastTick < 45) return
      lastTick = now
    }
    VOICES[sound]()
  },
}
