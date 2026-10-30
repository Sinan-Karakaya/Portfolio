'use client'

import { useEffect, useLayoutEffect } from 'react'
import { restoreBoot } from './boot'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// Rendered first in the layout: its layout effect runs before any component's
// regular effects, so they never see <html> without its boot attributes.
export default function BootGuard() {
  useIsomorphicLayoutEffect(() => {
    restoreBoot()
  }, [])
  return null
}
