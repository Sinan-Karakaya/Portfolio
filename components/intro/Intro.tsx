'use client'

import { useEffect } from 'react'
import { IntroVariant, siteConfig } from '@/config/site'
import { ensureBooted, setBoot } from '@/components/motion/boot'
import { sfx } from '@/components/motion/sfx'
import { INTRO_REPLAY_EVENT, INTRO_SEEN_KEY } from './events'
import type { IntroPlayer, IntroStrings } from './kit'
import { runIntro } from './runner'

// Each startup animation is its own chunk; only the one being played is downloaded.
const players: Record<IntroVariant, () => Promise<{ default: IntroPlayer }>> = {
  post: () => import('./variants/post'),
  allout: () => import('./variants/allout'),
  nous: () => import('./variants/nous'),
  lockon: () => import('./variants/lockon'),
}

const PORTRAIT = '/assets/images/me-signal.jpg'

export default function Intro({ variant, strings }: { lng: string; variant: IntroVariant; strings: IntroStrings }) {
  useEffect(() => {
    const html = document.documentElement
    const root = document.getElementById('sk-intro')
    if (!root) return
    ensureBooted()
    let active: ReturnType<typeof runIntro> | null = null
    let seq = 0

    const pick = (): IntroVariant => {
      const q = new URLSearchParams(window.location.search).get('intro') as IntroVariant | null
      return q && siteConfig.introVariants.includes(q) ? q : variant
    }

    const start = async (v: IntroVariant) => {
      const token = ++seq
      active?.destroy()
      active = null
      html.dataset.intro = 'on'
      root.dataset.state = 'playing'
      setBoot('pending')
      const { default: player } = await players[v]()
      if (token !== seq) return
      active = runIntro({
        root,
        player,
        strings,
        portrait: PORTRAIT,
        sound: (name) => sfx.play(name),
        onHandoff: () => setBoot('ready'),
        onDone: () => {
          html.dataset.intro = 'off'
          active = null
          try {
            sessionStorage.setItem(INTRO_SEEN_KEY, '1')
          } catch {}
        },
      })
    }

    if (html.dataset.intro === 'on') start(pick())

    const replay = () => {
      if (html.dataset.motion === 'on') start(pick())
    }
    window.addEventListener(INTRO_REPLAY_EVENT, replay)

    return () => {
      seq++
      window.removeEventListener(INTRO_REPLAY_EVENT, replay)
      if (active) {
        active.destroy()
        html.dataset.intro = 'off'
        setBoot('ready')
      }
    }
  }, [variant, strings])

  return null
}
