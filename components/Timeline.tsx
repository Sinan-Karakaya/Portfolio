import clsx from 'clsx'

export type Entry = { year: string; text: string }

// The career log, newest first, with dot-matrix years.
export default function Timeline({ entries, limit }: { entries: Entry[]; limit?: number }) {
  const indexed = entries.map((e, i) => ({ ...e, n: i + 1 })).reverse()
  const shown = limit ? indexed.slice(0, limit) : indexed

  return (
    <ol className='gutter mt-10'>
      {shown.map((entry, i) => (
        <li
          key={entry.n}
          data-reveal
          style={{ ['--d' as string]: i * 70 }}
          className='group grid-12 items-baseline gap-y-2 border-t border-line py-5 transition-colors last:border-b hover:bg-fg/[0.03] lg:py-6'
        >
          <span
            className={clsx(
              'font-dot col-span-4 text-[clamp(34px,4vw,64px)] font-black leading-none sm:col-span-3 lg:col-span-2',
              i === 0 ? 'text-accent' : 'text-fg'
            )}
          >
            {i === 0 && (
              <span
                aria-hidden='true'
                className='mr-3 inline-block h-[0.22em] w-[0.22em] translate-y-[-0.1em] bg-volt'
              />
            )}
            {entry.year}
          </span>
          <span className='label tabular col-span-8 text-right text-muted sm:col-span-2 sm:text-left lg:col-span-1'>
            LOG.{String(entry.n).padStart(2, '0')}
          </span>
          <p className='col-span-12 text-pretty text-[clamp(17px,1.4vw,21px)] leading-snug transition-transform duration-500 ease-out group-hover:translate-x-1 sm:col-span-7 lg:col-span-8'>
            {entry.text}
          </p>
        </li>
      ))}
    </ol>
  )
}
