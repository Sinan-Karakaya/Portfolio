import { ReactNode } from 'react'
import Decode from '@/components/motion/Decode'

export default function SectionHead({
  index,
  label,
  title,
  deck,
  aside,
}: {
  index: string
  label: string
  title: string
  deck?: string
  aside?: ReactNode
}) {
  return (
    <header className='gutter'>
      <div className='label flex items-center justify-between gap-4 border-t border-line pt-4 text-muted'>
        <Decode text={`§ ${index} — ${label}`} />
        {aside}
      </div>
      <div className='grid-12 mt-6 items-end gap-y-5 lg:mt-10'>
        <h2
          data-reveal='mask'
          className='display wdth-display col-span-12 text-[clamp(42px,7.2vw,124px)] lg:col-span-8'
        >
          {title}
        </h2>
        {deck && (
          <p
            data-reveal
            style={{ ['--d' as string]: 140 }}
            className='deck text-pretty col-span-12 text-[clamp(22px,2.1vw,34px)] text-muted lg:col-span-4 lg:text-right'
          >
            {deck}
          </p>
        )}
      </div>
    </header>
  )
}
