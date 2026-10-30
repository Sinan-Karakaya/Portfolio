'use client'

import { useEffect, useRef } from 'react'
import { motionEnabled } from '@/components/motion/boot'

const BASE = 75
const MIN = 62
const MAX = 125
const AMP = 42
const RADIUS = 95

// Hero name set on Archivo's width axis. Letters near the cursor stretch out while
// the rest of the line condenses to pay for it, so the line width never changes.
// Letters are split into spans, so the heading that wraps this carries an aria-label.
export default function StretchName({ lines, delay = 0 }: { lines: string[]; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !motionEnabled() || !window.matchMedia('(pointer: fine)').matches) return
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-line]')).map((line) =>
      Array.from(line.querySelectorAll<HTMLElement>('[data-ch]')).map((el) => ({ el, cur: BASE, target: BASE, w: 1 }))
    )
    let pointer: { x: number; y: number } | null = null
    let raf = 0

    const measure = () => rows.flat().forEach((c) => (c.w = c.el.getBoundingClientRect().width || 1))
    measure()

    const step = () => {
      raf = 0
      let moving = false
      for (const row of rows) {
        if (pointer) {
          const rect = row[0].el.parentElement!.getBoundingClientRect()
          const inRow = pointer.y >= rect.top - rect.height * 0.35 && pointer.y <= rect.bottom + rect.height * 0.35
          let weighted = 0
          let total = 0
          for (const c of row) {
            const r = c.el.getBoundingClientRect()
            const d = Math.abs(pointer.x - (r.left + r.width / 2))
            const g = inRow ? Math.exp(-((d / RADIUS) ** 2)) : 0
            c.target = AMP * g
            weighted += c.target * c.w
            total += c.w
          }
          const mean = weighted / total
          for (const c of row) c.target = Math.max(MIN, Math.min(MAX, BASE + c.target - mean))
        } else {
          for (const c of row) c.target = BASE
        }
        for (const c of row) {
          const next = c.cur + (c.target - c.cur) * 0.16
          if (Math.abs(next - c.cur) > 0.05) moving = true
          c.cur = next
          c.el.style.fontStretch = `${next.toFixed(2)}%`
        }
      }
      if (moving || pointer) raf = requestAnimationFrame(step)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step)
    }
    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY }
      kick()
    }
    const onLeave = () => {
      pointer = null
      kick()
    }
    const onResize = () => {
      rows.flat().forEach((c) => (c.el.style.fontStretch = `${BASE}%`))
      measure()
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <span
      ref={ref}
      className='block [container-type:inline-size]'
    >
      {lines.map((line, i) => (
        <span
          key={line}
          data-line
          data-reveal='mask'
          style={{ ['--d' as string]: delay + i * 110 }}
          className='display wdth-75 block whitespace-nowrap text-[calc(100cqw/4.9)] leading-[0.82]'
        >
          {Array.from(line).map((ch, j) => (
            <span
              key={j}
              data-ch
              className='inline-block'
            >
              {ch}
            </span>
          ))}
          {i < lines.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}
