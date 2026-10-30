'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { fallbackLng, languages } from '@/app/i18n/settings'
import Static from '@/components/Static'
import en from '@/app/i18n/locales/en/common.json'
import fr from '@/app/i18n/locales/fr/common.json'

const dictionaries = { en, fr }

export function useCommonDictionary() {
  const segment = usePathname()?.split('/')[1] ?? ''
  const lng = (languages.includes(segment) ? segment : fallbackLng) as keyof typeof dictionaries
  return { lng, dict: dictionaries[lng] }
}

// Shared frame for the 404 and error screens.
export default function SignalLost({
  code,
  title,
  deck,
  children,
}: {
  code: string
  title: string
  deck: string
  children: ReactNode
}) {
  return (
    <section className='gutter relative flex min-h-[calc(100svh-var(--hud-h))] flex-col justify-center overflow-hidden py-[10vh]'>
      <Static className='pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]' />
      <div className='relative'>
        <p className='label flex items-center gap-2 text-signal'>
          <span className='blink inline-block h-[7px] w-[7px] bg-signal' />
          ERR {code}
        </p>
        <p
          aria-hidden='true'
          className='font-dot mt-4 select-none text-[clamp(120px,30vw,460px)] font-black leading-[0.8] text-fg'
        >
          {code}
        </p>
        <h1 className='display wdth-display mt-6 text-[clamp(40px,7vw,120px)]'>{title}</h1>
        <p className='deck mt-4 max-w-[20em] text-[clamp(24px,2.6vw,40px)] text-muted'>{deck}</p>
        <div className='mt-10 flex flex-wrap gap-2.5'>{children}</div>
      </div>
    </section>
  )
}
