'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { atkinson, loadImage, paintBits, sampleGrid } from '@/components/dither'
import { bayer } from '@/components/intro/kit'
import { motionEnabled, onBootReady } from '@/components/motion/boot'
import { sfx } from '@/components/motion/sfx'

type Mode = 'dither' | 'ascii' | 'raw'

const DITHER_CELL = 3
const ASCII_CELL = 8
const RAMP = ' .:-=+*#%@'
const LENS = 112

const rgb = (name: string) =>
  `rgb(${getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(',')})`
const toHex = (css: string) => {
  const [r, g, b] = css.match(/\d+/g)!.map(Number)
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

// The hero figure: a 1-bit Atkinson portrait with an ASCII and a raw mode, and a
// HUD lens that shows the real photograph wherever the cursor goes.
export default function Portrait({
  src,
  signal,
  signalLight,
  alt,
  labels,
}: {
  src: string
  // Grayscale studies with the background pushed to black (Ink) or white (Bone).
  signal: string
  signalLight: string
  alt: string
  labels: { figure: string; dither: string; ascii: string; raw: string }
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('dither')
  const modeRef = useRef<Mode>('dither')
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const redraw = useRef<(reveal?: boolean) => void>(() => {})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = canvas.current
    const box = wrap.current
    if (!el || !box) return
    const ctx = el.getContext('2d')!
    const grays: Partial<Record<'ink' | 'bone', HTMLImageElement>> = {}
    const theme = () => (document.documentElement.dataset.theme === 'bone' ? 'bone' : 'ink')
    let color: HTMLImageElement | null = null
    let base: HTMLCanvasElement | null = null
    let order: Float32Array | null = null
    let pixels: ImageData | null = null
    const scratch = document.createElement('canvas')
    let raf = 0
    let alive = true
    let started = false

    const size = () => {
      const r = el.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      el.width = Math.round(r.width * dpr)
      el.height = Math.round(r.height * dpr)
      return { w: r.width, h: r.height, dpr }
    }

    // Renders the current mode into an offscreen canvas at device resolution.
    // Bright always maps to the lighter tone, so Bone prints ink on paper, never a negative.
    const build = () => {
      const gray = grays[theme()]
      if (!gray) return
      const { w, h, dpr } = size()
      const light = theme() === 'bone'
      const fg = rgb('--c-fg')
      const bg = rgb('--c-bg')
      if (modeRef.current === 'ascii') {
        const cols = Math.floor(w / ASCII_CELL)
        const rows = Math.floor(h / (ASCII_CELL * 1.25))
        const grid = sampleGrid(gray, cols, rows, 0.85, 1.25)
        const c = document.createElement('canvas')
        c.width = el.width
        c.height = el.height
        const x = c.getContext('2d')!
        x.fillStyle = bg
        x.fillRect(0, 0, c.width, c.height)
        x.fillStyle = light ? fg : rgb('--c-volt')
        const font = getComputedStyle(document.body).getPropertyValue('--font-mono').trim() || 'monospace'
        x.font = `500 ${ASCII_CELL * 1.18 * dpr}px ${font}`
        x.textAlign = 'center'
        x.textBaseline = 'middle'
        const cw = c.width / cols
        const ch = c.height / rows
        for (let yy = 0; yy < rows; yy++) {
          for (let xx = 0; xx < cols; xx++) {
            const l = light ? 1 - grid.luma[yy * cols + xx] : grid.luma[yy * cols + xx]
            const glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(l * RAMP.length))]
            if (glyph !== ' ') x.fillText(glyph, (xx + 0.5) * cw, (yy + 0.5) * ch)
          }
        }
        base = c
        order = null
      } else {
        const cols = Math.ceil(w / DITHER_CELL)
        const rows = Math.ceil(h / DITHER_CELL)
        const bits = atkinson(sampleGrid(gray, cols, rows, 0.8, 1.12))
        base = paintBits(bits, cols, rows, toHex(light ? bg : fg), toHex(light ? fg : bg))
        pixels = base.getContext('2d')!.getImageData(0, 0, cols, rows)
        scratch.width = cols
        scratch.height = rows
        order = new Float32Array(cols * rows)
        for (let yy = 0; yy < rows; yy++)
          for (let xx = 0; xx < cols; xx++) order[yy * cols + xx] = bayer(xx & 7, yy & 7) * 0.65 + Math.random() * 0.35
      }
    }

    const drawLens = () => {
      const p = pointer.current
      if (!p || !color || modeRef.current === 'raw') return
      const dpr = el.width / el.getBoundingClientRect().width
      const s = LENS * dpr
      const lx = Math.max(0, Math.min(el.width - s, p.x * dpr - s / 2))
      const ly = Math.max(0, Math.min(el.height - s, p.y * dpr - s / 2))
      // Map the lens rect back onto the colour photo (object-fit: cover).
      const ir = color.width / color.height
      const cr = el.width / el.height
      let sw = color.width
      let sh = color.height
      let sx = 0
      let sy = 0
      if (ir > cr) {
        sw = color.height * cr
        sx = (color.width - sw) / 2
      } else {
        sh = color.width / cr
        sy = (color.height - sh) / 2
      }
      const k = sw / el.width
      ctx.drawImage(color, sx + lx * k, sy + ly * k, s * k, s * k, lx, ly, s, s)
      ctx.strokeStyle = rgb('--c-volt')
      ctx.lineWidth = dpr
      ctx.strokeRect(lx + dpr / 2, ly + dpr / 2, s - dpr, s - dpr)
      ctx.fillStyle = rgb('--c-volt')
      const t = 9 * dpr
      ctx.fillRect(lx + s / 2 - dpr / 2, ly - t / 2, dpr, t)
      ctx.fillRect(lx + s / 2 - dpr / 2, ly + s - t / 2, dpr, t)
      ctx.fillRect(lx - t / 2, ly + s / 2 - dpr / 2, t, dpr)
      ctx.fillRect(lx + s - t / 2, ly + s / 2 - dpr / 2, t, dpr)
      const label = `${(p.x / el.getBoundingClientRect().width).toFixed(3)} · ${(
        p.y / el.getBoundingClientRect().height
      ).toFixed(3)}`
      ctx.font = `500 ${9.5 * dpr}px ${
        getComputedStyle(document.body).getPropertyValue('--font-mono').trim() || 'monospace'
      }`
      const tw = ctx.measureText(label).width + 10 * dpr
      const tx = Math.min(el.width - tw, lx)
      const ty = ly + s + 2 * dpr > el.height - 16 * dpr ? ly - 16 * dpr : ly + s + 2 * dpr
      ctx.fillRect(tx, ty, tw, 14 * dpr)
      ctx.fillStyle = rgb('--c-ink')
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'left'
      ctx.fillText(label, tx + 5 * dpr, ty + 7.5 * dpr)
    }

    const paint = (progress = 1) => {
      if (!base) return
      ctx.imageSmoothingEnabled = false
      if (progress >= 1 || !order) {
        ctx.drawImage(base, 0, 0, el.width, el.height)
      } else if (pixels) {
        // Reveal cells following the ordered-dither threshold.
        const data = new ImageData(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height)
        const [br, bgc, bb] = rgb('--c-bg').match(/\d+/g)!.map(Number)
        for (let i = 0; i < order.length; i++) {
          if (order[i] > progress) {
            data.data[i * 4] = br
            data.data[i * 4 + 1] = bgc
            data.data[i * 4 + 2] = bb
          }
        }
        scratch.getContext('2d')!.putImageData(data, 0, 0)
        ctx.drawImage(scratch, 0, 0, el.width, el.height)
      }
      drawLens()
    }

    const reveal = () => {
      cancelAnimationFrame(raf)
      if (!motionEnabled() || modeRef.current === 'ascii') return paint(1)
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 1100)
        paint(p)
        if (p < 1 && alive) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    redraw.current = (withReveal = false) => {
      build()
      withReveal ? reveal() : paint(1)
    }

    // Loads the study for the current theme (once), then renders.
    const ensureGray = async () => {
      const t = theme()
      if (!grays[t]) grays[t] = await loadImage(t === 'bone' ? signalLight : signal)
    }

    const start = async () => {
      if (started) return
      started = true
      try {
        ;[, color] = await Promise.all([ensureGray(), loadImage(src)])
      } catch {
        return
      }
      if (!alive) return
      setReady(true)
      redraw.current(true)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onBootReady(start)
    })
    io.observe(box)

    let resizeTimer: ReturnType<typeof setTimeout>
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => redraw.current(false), 120)
    })
    ro.observe(box)

    // Repaint when the theme flips.
    const mo = new MutationObserver(() => {
      if (!started) return
      ensureGray()
        .then(() => alive && redraw.current(false))
        .catch(() => {})
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top }
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          paint(1)
        })
    }
    const onLeave = () => {
      pointer.current = null
      paint(1)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [src, signal, signalLight])

  const choose = (next: Mode) => {
    if (next === mode) return
    sfx.play('select')
    modeRef.current = next
    setMode(next)
    if (next !== 'raw') redraw.current(true)
  }

  return (
    <figure className='flex flex-col'>
      <div
        ref={wrap}
        className='brackets relative aspect-[4/5] w-full bg-bg'
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          data-pending={ready ? undefined : ''}
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
            mode === 'raw' || !ready ? 'opacity-100' : 'opacity-0'
          )}
        />
        <canvas
          ref={canvas}
          aria-hidden='true'
          className={clsx(
            'absolute inset-0 h-full w-full cursor-crosshair transition-opacity duration-300 [image-rendering:pixelated]',
            mode === 'raw' ? 'pointer-events-none opacity-0' : 'opacity-100'
          )}
        />
      </div>
      <figcaption className='label mt-3 flex items-center justify-between gap-4'>
        <span className='text-muted'>{labels.figure}</span>
        <span
          role='group'
          aria-label={labels.figure}
          className='flex gap-px'
        >
          {(['dither', 'ascii', 'raw'] as Mode[]).map((m) => (
            <button
              key={m}
              type='button'
              aria-pressed={mode === m}
              onClick={() => choose(m)}
              className={clsx(
                'px-2 py-1 transition-colors',
                mode === m ? 'bg-volt text-ink' : 'text-muted hover:bg-fg/10 hover:text-fg'
              )}
            >
              {labels[m]}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  )
}
