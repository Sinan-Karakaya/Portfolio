import clsx from 'clsx'

// Deterministic decorative barcode: the same value always prints the same bars.
function bars(value: string, count: number) {
  let h = 2166136261
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    h ^= value.charCodeAt(i % value.length) + i * 31
    h = Math.imul(h, 16777619) >>> 0
    out.push(1 + (h % 4))
  }
  return out
}

export default function Barcode({
  value,
  height = 22,
  bars: count = 34,
  className,
}: {
  value: string
  height?: number
  bars?: number
  className?: string
}) {
  const widths = bars(value, count)
  let x = 0
  const rects = widths.map((w, i) => {
    const rect = i % 2 === 0 ? { x, w } : null
    x += w
    return rect
  })

  return (
    <svg
      aria-hidden='true'
      viewBox={`0 0 ${x} ${height}`}
      width={x * 1.5}
      height={height}
      preserveAspectRatio='none'
      shapeRendering='crispEdges'
      className={clsx('fill-current', className)}
    >
      {rects.map((r, i) =>
        r ? (
          <rect
            key={i}
            x={r.x}
            y={0}
            width={r.w}
            height={height}
          />
        ) : null
      )}
    </svg>
  )
}
