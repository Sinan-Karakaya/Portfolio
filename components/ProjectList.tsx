'use client'

import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight } from '@/components/icons'
import { Link } from '@/components/motion/Transition'
import { sfx } from '@/components/motion/sfx'

export type ProjectItem = {
  id: number
  number: string
  title: string
  languages: string[]
  coverImage: string
  summary: string
  href: string
}

type Labels = { all: string; filter: string; figure: string }

export default function ProjectList({
  projects,
  labels,
  filters = false,
  heading: Heading = 'h3',
}: {
  projects: ProjectItem[]
  labels: Labels
  filters?: boolean
  heading?: 'h2' | 'h3'
}) {
  const [tech, setTech] = useState<string | null>(null)
  const [hovered, setHovered] = useState<ProjectItem | null>(null)
  const [last, setLast] = useState<ProjectItem | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const techs = useMemo(() => {
    const counts = new Map<string, number>()
    projects.forEach((p) => p.languages.forEach((l) => counts.set(l, (counts.get(l) ?? 0) + 1)))
    return Array.from(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [projects])

  const shown = tech ? projects.filter((p) => p.languages.includes(tech)) : projects

  useEffect(() => {
    if (hovered) setLast(hovered)
  }, [hovered])

  useEffect(() => {
    const onMove = (e: PointerEvent) => (pointer.current = { x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // The floating preview trails the cursor while a row is hovered (fine pointers only).
  const active = hovered !== null
  useEffect(() => {
    const el = preview.current
    if (!el || !active || !window.matchMedia('(pointer: fine)').matches) return
    const pos = { ...pointer.current }
    let raf = 0
    const loop = () => {
      pos.x += (pointer.current.x - pos.x) * 0.18
      pos.y += (pointer.current.y - pos.y) * 0.18
      const w = el.offsetWidth
      const h = el.offsetHeight
      const x = Math.min(window.innerWidth - w - 16, pos.x + 28)
      const y = Math.max(16, Math.min(window.innerHeight - h - 16, pos.y - h / 2))
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <div>
      {filters && techs.length > 1 && (
        <div
          role='group'
          aria-label={labels.filter}
          className='gutter mb-8 mt-10 flex flex-wrap gap-1.5'
        >
          {[[null, projects.length] as const, ...techs].map(([t, n]) => (
            <button
              key={t ?? 'all'}
              type='button'
              aria-pressed={tech === t}
              onClick={() => {
                sfx.play('select')
                setTech(t)
              }}
              className={clsx('chip transition-colors', tech === t ? 'chip-volt' : 'hover:border-fg hover:text-fg')}
            >
              {t ?? labels.all}
              <span className={clsx('tabular', tech === t ? 'text-ink/60' : 'text-muted')}>
                {String(n).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
      )}

      <ol className={clsx('border-b border-line', !filters && 'mt-10')}>
        {shown.map((p, i) => (
          <li
            key={p.id}
            data-reveal
            style={{ ['--d' as string]: i * 70 }}
            className='border-t border-line'
          >
            <Link
              href={p.href}
              label={p.title}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(p)}
              onBlur={() => setHovered(null)}
              className='project-row group gutter block'
            >
              <div className='grid-12 items-center gap-y-3 py-6 lg:py-8'>
                <span className='label tabular col-span-2 text-muted transition-colors group-hover:text-ink/60 lg:col-span-1'>
                  {p.number}
                </span>
                <Heading className='display wdth-75 col-span-10 text-balance text-[clamp(36px,5.4vw,92px)] leading-[0.86] transition-transform duration-500 ease-out group-hover:translate-x-2 lg:col-span-6'>
                  {p.title}
                </Heading>
                <ul className='col-span-12 flex flex-wrap gap-1.5 lg:col-span-4 lg:justify-end'>
                  {p.languages.slice(0, 4).map((l) => (
                    <li
                      key={l}
                      className='chip transition-colors group-hover:border-ink/40'
                    >
                      {l}
                    </li>
                  ))}
                </ul>
                <span className='hidden justify-end lg:col-span-1 lg:flex'>
                  <ArrowRight
                    size={26}
                    className='transition-transform duration-500 ease-out group-hover:translate-x-1'
                  />
                </span>
                {p.summary && (
                  <p className='col-span-12 line-clamp-2 max-w-[70ch] text-[15px] leading-relaxed text-muted transition-colors group-hover:text-ink/70 lg:col-span-7 lg:col-start-2'>
                    {p.summary}
                  </p>
                )}
              </div>
              <div className='duotone mb-6 aspect-[16/9] lg:hidden'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.coverImage}
                  alt=''
                  loading='lazy'
                  decoding='async'
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <div
        ref={preview}
        aria-hidden='true'
        className={clsx(
          'pointer-events-none fixed left-0 top-0 z-[50] hidden w-[min(30vw,380px)] transition-[clip-path,opacity] duration-500 ease-out lg:block',
          hovered ? 'opacity-100 [clip-path:inset(0_0_0_0)]' : 'opacity-0 [clip-path:inset(0_0_100%_0)]'
        )}
      >
        {last && (
          <>
            <div
              className='duotone brackets aspect-[4/3] bg-ink'
              data-live='true'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={last.id}
                src={last.coverImage}
                alt=''
                decoding='async'
              />
            </div>
            <p className='label mt-2 flex justify-between gap-4 bg-ink px-2 py-1.5 text-bone'>
              <span className='whitespace-nowrap'>
                {labels.figure} {last.number}
              </span>
              <span className='truncate text-volt'>{last.title}</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
