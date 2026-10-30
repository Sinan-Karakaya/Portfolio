// Framework-agnostic toolkit shared by the startup animations. No React here:
// each intro builds its own DOM inside the overlay and drives it with WAAPI,
// timers and canvas, so it can also run outside the app.

export type IntroStrings = {
  name: string
  role: string
  skip: string
  post: string[]
  ok: string
  linked: string
  ready: string
  acquired: string
  tagline: string
  plate: string
  coordinates: string
  city: string
  stamps: Record<string, string>
  online: string
}

export type IntroContext = {
  root: HTMLElement
  strings: IntroStrings
  portrait: string
  sound: (name: 'tick' | 'blip' | 'select' | 'toggle' | 'whoosh' | 'confirm' | 'thump') => void
  // Call when the page underneath may start revealing itself.
  handoff: () => void
  // Call when the overlay is fully gone.
  done: () => void
}

export type IntroHandle = { destroy: () => void }
export type IntroPlayer = (ctx: IntroContext) => IntroHandle

export const C = { ink: '#0a0a0b', bone: '#ebe9e3', volt: '#ccff00', signal: '#ff4d2e', muted: '#8b8a85' }

export const F = {
  display: 'var(--font-display), "Archivo", system-ui, sans-serif',
  mono: 'var(--font-mono), "Martian Mono", ui-monospace, monospace',
  serif: 'var(--font-serif), "Instrument Serif", Georgia, serif',
  dot: 'var(--font-dot), "Doto", ui-monospace, monospace',
}

export const EASE = {
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inOut: 'cubic-bezier(0.76, 0, 0.24, 1)',
  snap: 'cubic-bezier(0.85, 0, 0.15, 1)',
  back: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  in: 'cubic-bezier(0.7, 0, 0.84, 0)',
}

type Props = {
  class?: string
  style?: Partial<CSSStyleDeclaration> | Record<string, string>
  text?: string
  attrs?: Record<string, string>
}

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Props = {}, ...children: (Node | string)[]) {
  const el = document.createElement(tag)
  if (props.class) el.className = props.class
  if (props.style) Object.assign(el.style, props.style)
  if (props.text !== undefined) el.textContent = props.text
  if (props.attrs) for (const [k, v] of Object.entries(props.attrs)) el.setAttribute(k, v)
  for (const c of children) el.append(c)
  return el
}

export function style(root: HTMLElement, css: string) {
  root.append(h('style', { text: css }))
}

export function animate(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  return el
    .animate(keyframes, { fill: 'both', ...options })
    .finished.then(() => undefined)
    .catch(() => undefined)
}

// Timers and loops that can all be torn down at once.
export function scheduler() {
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const frames = new Set<number>()
  let dead = false
  return {
    at(ms: number, fn: () => void) {
      const id = setTimeout(() => {
        timers.delete(id)
        if (!dead) fn()
      }, ms)
      timers.add(id)
    },
    loop(fn: (t: number) => boolean | void) {
      const start = performance.now()
      const tick = (now: number) => {
        if (dead) return
        if (fn(now - start) === false) return
        const id = requestAnimationFrame(tick)
        frames.add(id)
      }
      frames.add(requestAnimationFrame(tick))
    },
    get dead() {
      return dead
    },
    kill() {
      dead = true
      timers.forEach(clearTimeout)
      frames.forEach(cancelAnimationFrame)
    },
  }
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>[]'

export function scramble(el: HTMLElement, text: string, duration: number, s: ReturnType<typeof scheduler>) {
  const settle = Array.from(text, (_, i) => (i / Math.max(1, text.length)) * 0.6 + Math.random() * 0.4)
  s.loop((t) => {
    const p = Math.min(1, t / duration)
    let out = ''
    for (let i = 0; i < text.length; i++)
      out += text[i] === ' ' || p >= settle[i] ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    el.textContent = out
    return p < 1
  })
}

export function typewrite(
  el: HTMLElement,
  text: string,
  msPerChar: number,
  s: ReturnType<typeof scheduler>,
  onDone?: () => void
) {
  s.loop((t) => {
    const n = Math.min(text.length, Math.floor(t / msPerChar))
    el.textContent = text.slice(0, n)
    if (n >= text.length) {
      onDone?.()
      return false
    }
  })
}

// Font size at which `text` fills `width` on one line, measured with the real face.
export function fitSize(text: string, width: number, styles: Partial<CSSStyleDeclaration>) {
  const probe = h('span', {
    text,
    style: {
      position: 'absolute',
      visibility: 'hidden',
      whiteSpace: 'nowrap',
      fontSize: '100px',
      ...styles,
    } as Partial<CSSStyleDeclaration>,
  })
  document.body.append(probe)
  const w = probe.getBoundingClientRect().width || 1
  probe.remove()
  return (100 * width) / w
}

// 8×8 ordered-dither (Bayer) threshold in [0, 1): the low bits of x/y are the most
// significant, which is what spreads consecutive thresholds evenly across the tile.
export const bayer = (x: number, y: number) => {
  let v = 0
  for (let bit = 0; bit < 3; bit++) {
    const xb = (x >> bit) & 1
    const yb = (y >> bit) & 1
    v |= (((xb ^ yb) << 1) | yb) << (2 * (2 - bit))
  }
  return v / 64
}
