'use client'

import { ElementType, useCallback, useEffect, useRef } from 'react'
import { motionEnabled, onBootReady } from './boot'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>[]'

// Scrambles `el` from noise into `text`, character by character, left to right.
export function scramble(el: HTMLElement, text: string, duration = 650) {
  const start = performance.now()
  const settle = Array.from(text, (_, i) => (i / Math.max(1, text.length)) * 0.6 + Math.random() * 0.4)
  let raf = 0
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / duration)
    let out = ''
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      out += ch === ' ' || p >= settle[i] ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => {
    cancelAnimationFrame(raf)
    el.textContent = text
  }
}

type DecodeProps = {
  text: string
  as?: ElementType
  className?: string
  duration?: number
  delay?: number
  hover?: boolean
}

// Text that decodes when it scrolls into view (after boot) and, optionally, again on hover.
// The real string is server-rendered; the inner span is keyed so React never loses track of it.
export default function Decode({
  text,
  as: Tag = 'span',
  className,
  duration = 650,
  delay = 0,
  hover = false,
}: DecodeProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const stop = useRef<(() => void) | null>(null)

  const run = useCallback(
    (ms = duration) => {
      const el = ref.current
      if (!el || !motionEnabled()) return
      stop.current?.()
      stop.current = scramble(el, text, ms)
    },
    [text, duration]
  )

  useEffect(() => {
    const el = ref.current
    if (!el || !motionEnabled()) return
    let timer: ReturnType<typeof setTimeout>
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      timer = setTimeout(() => run(), delay)
    })
    const off = onBootReady(() => io.observe(el))
    return () => {
      off()
      io.disconnect()
      clearTimeout(timer)
      stop.current?.()
    }
  }, [run, delay])

  return (
    <Tag
      className={className}
      onMouseEnter={hover ? () => run(380) : undefined}
    >
      <span
        key={text}
        ref={ref}
      >
        {text}
      </span>
    </Tag>
  )
}
