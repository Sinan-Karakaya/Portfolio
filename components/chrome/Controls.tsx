'use client'

import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Link } from '@/components/motion/Transition'
import { sfx } from '@/components/motion/sfx'
import { languages } from '@/app/i18n/settings'

const LANGUAGE_NAMES: Record<string, string> = { en: 'English', fr: 'Français' }

export function LangSwitch({ lng, label }: { lng: string; label: string }) {
  const pathname = usePathname()
  const rest = pathname.replace(/^\/[^/]+/, '')

  return (
    <span
      className='label flex items-center gap-1.5'
      role='group'
      aria-label={label}
    >
      {languages.map((code, i) => (
        <span
          key={code}
          className='flex items-center gap-1.5'
        >
          {i > 0 && (
            <span
              aria-hidden='true'
              className='text-faint'
            >
              /
            </span>
          )}
          {code === lng ? (
            <span
              className='text-fg'
              aria-current='true'
            >
              {code.toUpperCase()}
            </span>
          ) : (
            <Link
              href={`/${code}${rest}`}
              label={LANGUAGE_NAMES[code]}
              hrefLang={code}
              lang={code}
              className='text-muted transition-colors hover:text-fg'
            >
              <span className='sr-only'>{LANGUAGE_NAMES[code]}</span>
              <span aria-hidden='true'>{code.toUpperCase()}</span>
            </Link>
          )}
        </span>
      ))}
    </span>
  )
}

export function ThemeToggle({ labels }: { labels: { label: string; ink: string; bone: string } }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const bone = mounted && resolvedTheme === 'bone'

  return (
    <button
      type='button'
      onClick={() => {
        sfx.play('toggle')
        setTheme(bone ? 'ink' : 'bone')
      }}
      aria-label={labels.label}
      className='label flex items-center gap-2 text-muted transition-colors hover:text-fg'
    >
      <svg
        aria-hidden='true'
        width='11'
        height='11'
        viewBox='0 0 12 12'
        className={clsx('transition-transform duration-500 ease-out', bone && 'rotate-180')}
      >
        <circle
          cx='6'
          cy='6'
          r='5.25'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.2'
        />
        <path
          d='M6 0.75a5.25 5.25 0 0 1 0 10.5z'
          fill='currentColor'
        />
      </svg>
      <span className='min-w-[3.2em]'>{mounted ? (bone ? labels.bone : labels.ink) : labels.ink}</span>
    </button>
  )
}

export function SoundToggle({ labels }: { labels: { label: string; on: string; off: string } }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    setOn(sfx.isEnabled())
    return sfx.subscribe(setOn)
  }, [])

  return (
    <button
      type='button'
      onClick={() => sfx.set(!on)}
      aria-pressed={on}
      aria-label={labels.label}
      className={clsx('label flex items-center gap-2 transition-colors hover:text-fg', on ? 'text-fg' : 'text-muted')}
    >
      <span
        aria-hidden='true'
        className='flex h-[10px] items-end gap-[2px]'
      >
        {[0.5, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className={clsx('w-[2px] origin-bottom bg-current', on && 'animate-[sk-eq_0.9s_ease-in-out_infinite]')}
            style={{ height: `${h * 10}px`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      <span>{on ? labels.on : labels.off}</span>
    </button>
  )
}

export function Clock({ timeZone, code, label }: { timeZone: string; code: string; label: string }) {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timeZone])

  return (
    <span
      className='label flex items-center gap-2'
      title={label}
    >
      <span className='blink inline-block h-[6px] w-[6px] bg-volt' />
      <span className='text-muted'>{code}</span>
      <time
        className='tabular min-w-[5.6em]'
        suppressHydrationWarning
      >
        {time ?? '--:--:--'}
      </time>
    </span>
  )
}
