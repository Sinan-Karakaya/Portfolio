import Barcode from '@/components/ui/Barcode'

export type Module = { name: string; stack: string[]; text: string }

// Capability modules, notched like gear cards.
export default function Loadout({ modules }: { modules: Module[] }) {
  return (
    <ul className='gutter mt-10 grid gap-[var(--col-gap)] sm:grid-cols-2 xl:grid-cols-4'>
      {modules.map((m, i) => (
        <li
          key={m.name}
          data-reveal
          style={{ ['--d' as string]: i * 90 }}
          className='module group flex min-h-[17rem] flex-col p-5 sm:min-h-[22rem] lg:p-6'
        >
          <div className='label flex items-start justify-between gap-4 text-muted'>
            <span className='transition-colors group-hover:text-accent'>MOD—{String(i + 1).padStart(2, '0')}</span>
            <Barcode
              value={m.name}
              bars={24}
              height={16}
              className='text-fg/50 transition-colors group-hover:text-accent'
            />
          </div>
          <h3 className='display wdth-125 mt-auto pt-14 text-[clamp(26px,2.3vw,36px)] transition-transform duration-500 ease-out group-hover:translate-x-1'>
            {m.name}
          </h3>
          <p className='mt-3 text-pretty text-[15px] leading-relaxed text-muted'>{m.text}</p>
          <ul className='mt-6 flex flex-wrap gap-1.5'>
            {m.stack.map((s) => (
              <li
                key={s}
                className='chip'
              >
                {s}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
