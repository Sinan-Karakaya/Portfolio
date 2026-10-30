import { Fragment } from 'react'

const Star = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 10 10'
    className='mx-[0.7em] inline-block h-[0.62em] w-[0.62em] fill-current align-[0.05em]'
    shapeRendering='crispEdges'
  >
    <path d='M4 0h2v4h4v2H6v4H4V6H0V4h4z' />
  </svg>
)

// The volt stack ticker, set slightly off-axis like tape stuck across the page.
export default function Marquee({ items, label }: { items: string[]; label: string }) {
  const run = [...items, ...items, ...items]
  return (
    <div className='relative z-[1] my-[3vh] overflow-hidden py-[max(24px,1.6vw)]'>
      <div
        className='-rotate-[1.4deg] scale-x-[1.03] overflow-hidden bg-volt py-3 text-ink'
        role='marquee'
        aria-label={label}
      >
        <div
          className='marquee'
          aria-hidden='true'
        >
          <div
            className='marquee-track'
            style={{ ['--marquee-duration' as string]: `${run.length * 1.6}s` }}
          >
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className='display wdth-125 flex shrink-0 items-center whitespace-nowrap text-[clamp(15px,1.5vw,22px)] leading-none'
              >
                {run.map((item, i) => (
                  <Fragment key={`${copy}-${i}`}>
                    {item}
                    <Star />
                  </Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
