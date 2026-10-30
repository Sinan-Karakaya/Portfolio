'use client'

import { useEffect } from 'react'
import { BOOT_EVENT, isBootReady, motionEnabled } from './boot'

// Marks [data-reveal] elements with data-in once the page has booted and they scroll into view.
export default function RevealObserver() {
  useEffect(() => {
    if (!motionEnabled()) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.in = ''
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 }
    )

    let frame = 0
    const scan = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!isBootReady()) return
        document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])').forEach((el) => io.observe(el))
      })
    }

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    window.addEventListener(BOOT_EVENT, scan)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      mo.disconnect()
      window.removeEventListener(BOOT_EVENT, scan)
    }
  }, [])

  return null
}
