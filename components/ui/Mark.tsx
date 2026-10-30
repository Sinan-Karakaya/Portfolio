import clsx from 'clsx'

// The SK monogram: a 5×7 pixel S and K set on a 14-unit square, like a sticker on a crate.
const PIXELS: [number, number, number, number][] = [
  // S
  [1, 3, 5, 1],
  [1, 4, 1, 2],
  [1, 6, 5, 1],
  [5, 7, 1, 2],
  [1, 9, 5, 1],
  // K
  [8, 3, 1, 7],
  [12, 3, 1, 1],
  [11, 4, 1, 1],
  [10, 5, 1, 1],
  [9, 6, 1, 1],
  [10, 7, 1, 1],
  [11, 8, 1, 1],
  [12, 9, 1, 1],
]

export default function Mark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden='true'
      width={size}
      height={size}
      viewBox='0 0 14 14'
      shapeRendering='crispEdges'
      className={clsx('sk-mark shrink-0', className)}
    >
      <rect
        width='14'
        height='14'
        className='fill-volt'
      />
      <g className='fill-ink'>
        {PIXELS.map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            style={{ ['--i' as string]: i }}
          />
        ))}
      </g>
    </svg>
  )
}
