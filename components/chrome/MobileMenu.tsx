'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@/components/motion/Transition'
import { sfx } from '@/components/motion/sfx'
import { NavItem, isActive } from './NavLinks'

export default function MobileMenu({
  items,
  home,
  labels,
  children,
}: {
  items: NavItem[]
  home: string
  labels: { menu: string; close: string }
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const button = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (panel.current) panel.current.inert = !open
  }, [open, mounted])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    // The toggle disappears at the desktop breakpoint, so the menu must not outlive it.
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onDesktop = () => desktop.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onDesktop)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [open])

  return (
    <>
      <button
        ref={button}
        type='button'
        aria-expanded={open}
        aria-controls='sk-mobile-menu'
        onClick={() => {
          sfx.play('select')
          setOpen((v) => !v)
        }}
        className='label relative flex items-center gap-2.5 py-2'
      >
        <span>{open ? labels.close : labels.menu}</span>
        <span
          aria-hidden='true'
          className='relative h-[9px] w-[16px]'
        >
          <span
            className={clsx(
              'absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ease-out',
              open && 'translate-y-[4px] rotate-45'
            )}
          />
          <span
            className={clsx(
              'absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ease-out',
              open && '-translate-y-[4px] -rotate-45'
            )}
          />
        </span>
      </button>

      {mounted &&
        createPortal(
          <div
            id='sk-mobile-menu'
            ref={panel}
            aria-hidden={!open}
            className={clsx(
              'fixed inset-0 z-[59] flex flex-col bg-bg pt-hud transition-[clip-path] duration-500 ease-in-out lg:hidden',
              open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'
            )}
          >
            <nav className='gutter flex flex-1 flex-col justify-center gap-1'>
              {items.map((item, i) => {
                const active = isActive(pathname, item.href, home)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    aria-current={active ? 'page' : undefined}
                    // The same page doesn't navigate, so close the menu here.
                    onClick={() => item.href === pathname && setOpen(false)}
                    className={clsx(
                      'group flex items-baseline gap-4 border-b border-line py-3 transition-[transform,opacity] duration-500 ease-out',
                      open ? 'translate-x-0 skew-x-0 opacity-100' : '-translate-x-8 -skew-x-12 opacity-0'
                    )}
                    style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
                  >
                    <span className={clsx('label tabular px-1.5 py-0.5', active ? 'bg-volt text-ink' : 'text-muted')}>
                      {item.index}
                    </span>
                    <span
                      className={clsx(
                        'display wdth-125 text-[clamp(34px,11vw,72px)] transition-colors',
                        active ? 'text-accent' : 'group-hover:text-accent'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
            <div
              className={clsx(
                'gutter flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-5 transition-opacity duration-500',
                open ? 'opacity-100 delay-300' : 'opacity-0'
              )}
            >
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
