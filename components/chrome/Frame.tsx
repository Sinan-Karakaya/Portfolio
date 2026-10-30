'use client'

import { useEffect, useRef, useState } from 'react'
import { sfx } from '@/components/motion/sfx'

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0')

// The viewport frame: registration marks, side rails, a scroll meter, a cursor
// readout and a 12-column grid overlay toggled with the G key.
export default function Frame({ rail }: { rail: string }) {
  const coords = useRef<HTMLSpanElement>(null)
  const meter = useRef<HTMLSpanElement>(null)
  const meterText = useRef<HTMLSpanElement>(null)
  const [grid, setGrid] = useState(false)

  useEffect(() => {
    let frame = 0
    let x = 0
    let y = 0
    const paint = () => {
      frame = 0
      if (coords.current) coords.current.textContent = `X ${pad(x)}  Y ${pad(y)}`
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (meter.current) meter.current.style.transform = `translateY(${p * 100}%)`
      if (meterText.current) meterText.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      schedule()
    }
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.metaKey || e.ctrlKey || e.altKey || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
        return
      if (e.key === 'g' || e.key === 'G') {
        sfx.play('toggle')
        setGrid((g) => !g)
      }
    }
    paint()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 z-[55]'
    >
      {(
        [
          'left-[5px] top-[5px]',
          'right-[5px] top-[5px]',
          'bottom-[5px] left-[5px]',
          'bottom-[5px] right-[5px]',
        ] as const
      ).map((pos) => (
        <span
          key={pos}
          className={`absolute h-[9px] w-[9px] ${pos} before:absolute before:left-[4px] before:top-0 before:h-full before:w-px before:bg-fg/70 after:absolute after:left-0 after:top-[4px] after:h-px after:w-full after:bg-fg/70`}
        />
      ))}

      <div className='absolute bottom-[12vh] left-0 top-[calc(var(--hud-h)+12vh)] hidden w-[var(--gutter)] flex-col items-center justify-between xl:flex'>
        <span className='label whitespace-nowrap text-faint [writing-mode:vertical-rl] rotate-180'>{rail}</span>
        <span
          ref={coords}
          className='label tabular whitespace-nowrap text-faint [writing-mode:vertical-rl] rotate-180'
        >
          X 0000 Y 0000
        </span>
      </div>

      <div className='absolute right-0 top-1/2 hidden w-[var(--gutter)] -translate-y-1/2 flex-col items-center gap-3 xl:flex'>
        <span
          ref={meterText}
          className='label tabular text-muted'
        >
          000
        </span>
        <span className='relative block h-32 w-px bg-line-2'>
          <span
            ref={meter}
            className='absolute left-1/2 top-0 block h-full w-[5px] -translate-x-1/2'
          >
            <span className='absolute left-0 top-0 block h-[5px] w-[5px] -translate-y-1/2 bg-volt' />
          </span>
        </span>
      </div>

      {grid && (
        <div className='gutter absolute inset-0 z-[1]'>
          <div className='grid-12 h-full'>
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className='h-full border-x border-volt/30 bg-volt/[0.06]'
              />
            ))}
          </div>
          <span className='label absolute bottom-3 right-[var(--gutter)] bg-volt px-2 py-1 text-ink'>Grid 12 · G</span>
        </div>
      )}
    </div>
  )
}
