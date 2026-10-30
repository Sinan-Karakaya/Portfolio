'use client'

import { useEffect, useRef } from 'react'
import { motionEnabled } from '@/components/motion/boot'

// Television static at quarter resolution, for pages that lost their signal.
export default function Static({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let tick = 0
    const resize = () => {
      canvas.width = Math.ceil(canvas.offsetWidth / 3)
      canvas.height = Math.ceil(canvas.offsetHeight / 3)
    }
    const draw = () => {
      const img = ctx.createImageData(canvas.width, canvas.height)
      const band = (tick * 3) % canvas.height
      for (let i = 0; i < img.data.length; i += 4) {
        const y = Math.floor(i / 4 / canvas.width)
        const v = Math.random() * 255 * (Math.abs(y - band) < 6 ? 1 : 0.55)
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
    }
    const loop = () => {
      if (tick++ % 2 === 0) draw()
      raf = requestAnimationFrame(loop)
    }
    resize()
    draw()
    if (motionEnabled()) raf = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden='true'
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
