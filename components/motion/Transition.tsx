'use client'

import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ComponentProps, MouseEvent, ReactNode, createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { motionEnabled, setBoot } from './boot'
import { sfx } from './sfx'

// Persona-style page transitions: three slashed bands sweep across, the destination
// is announced, the route swaps underneath, and the bands carry on out the other side.

type Go = (href: string, label?: string) => void
const TransitionContext = createContext<Go | null>(null)

const BANDS = ['bg-volt', 'bg-fg', 'bg-bg-2']
const SKEW = 'skewX(-14deg)'

export function TransitionProvider({ children, loadingLabel }: { children: ReactNode; loadingLabel: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const overlay = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLParagraphElement>(null)
  const path = useRef<HTMLSpanElement>(null)
  const pending = useRef<string | null>(null)
  const from = useRef<string | null>(null)
  const busy = useRef(false)
  const safety = useRef<ReturnType<typeof setTimeout>>()

  const bands = () => Array.from(overlay.current?.querySelectorAll<HTMLElement>('[data-band]') ?? [])

  const uncover = useCallback(() => {
    clearTimeout(safety.current)
    pending.current = null
    const root = overlay.current
    if (!root) return
    window.scrollTo(0, 0)
    setBoot('ready')
    root
      .querySelector<HTMLElement>('[data-label]')
      ?.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateX(4vw)' }], {
        duration: 220,
        easing: 'ease-in',
        fill: 'forwards',
      })
    const runs = bands()
      .reverse()
      .map(
        (band, i) =>
          band.animate([{ transform: `translateX(0) ${SKEW}` }, { transform: `translateX(135%) ${SKEW}` }], {
            duration: 560,
            delay: 80 + i * 70,
            easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
            fill: 'forwards',
          }).finished
      )
    Promise.all(runs)
      .catch(() => {})
      .then(() => {
        root.style.visibility = 'hidden'
        root.style.pointerEvents = 'none'
        busy.current = false
      })
  }, [])

  const go = useCallback<Go>(
    (href, label) => {
      const url = new URL(href, window.location.href)
      if (url.pathname === window.location.pathname) {
        window.scrollTo({ top: 0, behavior: motionEnabled() ? 'smooth' : 'auto' })
        return
      }
      const root = overlay.current
      if (!motionEnabled() || !root) {
        router.push(url.pathname + url.search + url.hash)
        return
      }
      if (busy.current) return
      busy.current = true
      sfx.play('whoosh')

      if (title.current) title.current.textContent = label ?? ''
      if (path.current) path.current.textContent = url.pathname
      root.style.visibility = 'visible'
      root.style.pointerEvents = 'auto'
      const labelEl = root.querySelector<HTMLElement>('[data-label]')
      labelEl?.getAnimations().forEach((a) => a.cancel())
      labelEl?.animate(
        [
          { opacity: 0, transform: 'translateX(-4vw)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: 420,
          delay: 260,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        }
      )
      const runs = bands().map(
        (band, i) =>
          band.animate([{ transform: `translateX(-135%) ${SKEW}` }, { transform: `translateX(0) ${SKEW}` }], {
            duration: 480,
            delay: i * 95,
            easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
            fill: 'forwards',
          }).finished
      )
      Promise.all(runs)
        .catch(() => {})
        .then(() => {
          setBoot('pending')
          pending.current = url.pathname
          from.current = window.location.pathname
          router.push(url.pathname + url.search + url.hash, { scroll: false })
          safety.current = setTimeout(uncover, 6000)
        })
    },
    [router, uncover]
  )

  useEffect(() => {
    if (pending.current && pathname !== from.current) {
      // Give the new route a frame to paint before opening the shutters.
      requestAnimationFrame(() => requestAnimationFrame(uncover))
    }
  }, [pathname, uncover])

  useEffect(() => () => clearTimeout(safety.current), [])

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        ref={overlay}
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 z-[95] overflow-hidden'
        style={{ visibility: 'hidden' }}
      >
        {BANDS.map((color, i) => (
          <div
            key={color}
            data-band
            className={`absolute inset-y-0 -left-[25vw] w-[150vw] ${color}`}
            style={{ transform: `translateX(-135%) ${SKEW}`, zIndex: i }}
          />
        ))}
        <div
          data-label
          className='gutter absolute inset-x-0 bottom-[12vh] z-10 text-fg opacity-0'
        >
          <div className='label mb-4 flex items-center gap-3 text-muted'>
            <span className='inline-block h-[7px] w-[7px] animate-pulse bg-volt' />
            <span>{loadingLabel}</span>
            <span ref={path} />
          </div>
          <p
            ref={title}
            className='display wdth-display text-[clamp(44px,10vw,170px)]'
          />
          <div className='mt-6 h-px w-full overflow-hidden bg-line'>
            <div className='h-full w-1/3 animate-[sk-load_1.1s_var(--ease-in-out)_infinite] bg-volt' />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

export function useTransitionNav() {
  return useContext(TransitionContext)
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: string
  label?: string
  sound?: boolean
}

// Drop-in replacement for next/link that plays the page transition.
export function Link({ href, label, onClick, onMouseEnter, sound = true, ...rest }: LinkProps) {
  const go = useTransitionNav()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || !go) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (rest.target && rest.target !== '_self') return
    if (/^(https?:|mailto:|tel:)/.test(href) || href.startsWith('#')) return
    e.preventDefault()
    if (sound) sfx.play('select')
    go(href, label)
  }

  return (
    <NextLink
      href={href}
      onClick={handleClick}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        if (sound) sfx.play('tick')
      }}
      {...rest}
    />
  )
}
