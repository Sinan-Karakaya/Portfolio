import { atkinson, loadImage, paintBits, sampleGrid } from '../../dither'
import { C, EASE, F, IntroPlayer, animate, bayer, h, scheduler, style } from '../kit'

// 03 — NOUS · Plate I.
// Film grain, then the portrait arrives the way images used to: coarse blocks
// resolving line by line into a 1-bit plate. A single serif line, and the frame
// dissolves cell by cell through an ordered-dither threshold.

const CSS = `
.n-root{position:absolute;inset:0;background:${C.ink};color:${C.bone};--g:clamp(16px,2.4vw,36px)}
.n-grain{position:absolute;inset:0;width:100%;height:100%;opacity:.55;image-rendering:pixelated;pointer-events:none}
.n-corner{position:absolute;font:400 10.5px/1.4 ${F.mono};font-stretch:87.5%;letter-spacing:.06em;text-transform:uppercase;color:${C.muted};opacity:0}
.n-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0}
.n-plate{width:min(70vw,42vh);position:relative}
.n-cap{display:flex;justify-content:space-between;font:400 10px/1 ${F.mono};font-stretch:87.5%;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};padding:10px 0;opacity:0}
.n-cap b{font-weight:400;color:${C.bone}} .n-cap i{font-style:normal;color:${C.volt}}
.n-frame{position:relative;aspect-ratio:4/5;outline:1px solid rgba(235,233,227,.22);outline-offset:6px}
.n-frame canvas{width:100%;height:100%;display:block;image-rendering:pixelated}
.n-frame::before,.n-frame::after{content:'';position:absolute;width:14px;height:14px;border:1px solid ${C.bone}}
.n-frame::before{left:-10px;top:-10px;border-right:0;border-bottom:0}
.n-frame::after{right:-10px;bottom:-10px;border-left:0;border-top:0}
.n-tag{margin-top:clamp(18px,3.4vh,34px);font:400 italic clamp(30px,4.4vw,68px)/1 ${F.serif};letter-spacing:-.01em;text-align:center;white-space:nowrap}
.n-tag span{display:inline-block;opacity:0;white-space:pre}
.n-dissolve{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
`

const STEPS = [36, 18, 9, 5, 3]

function roman(n: number) {
  const map: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let out = ''
  for (const [v, r] of map) while (n >= v) (out += r), (n -= v)
  return out
}

const player: IntroPlayer = ({ root, strings, portrait, sound, handoff, done }) => {
  const s = scheduler()
  style(root, CSS)
  const stage = h('div', { class: 'n-root' })
  root.append(stage)

  // Film grain at quarter resolution.
  const grain = h('canvas', { class: 'n-grain' })
  stage.append(grain)
  const gctx = grain.getContext('2d')!
  grain.width = Math.ceil(window.innerWidth / 4)
  grain.height = Math.ceil(window.innerHeight / 4)
  const noise = gctx.createImageData(grain.width, grain.height)
  let flip = 0
  s.loop(() => {
    if ((flip = (flip + 1) % 2)) return
    const d = noise.data
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0
      d[i] = d[i + 1] = d[i + 2] = v
      d[i + 3] = 22
    }
    gctx.putImageData(noise, 0, 0)
  })

  const corners = [
    ['SK / OS', { left: 'var(--g)', top: 'var(--g)' }],
    [roman(new Date().getFullYear()), { right: 'var(--g)', top: 'var(--g)' }],
    [strings.coordinates, { left: 'var(--g)', bottom: 'var(--g)' }],
    [strings.city, { right: 'var(--g)', bottom: 'var(--g)' }],
  ].map(([text, pos]) => h('span', { class: 'n-corner', text: text as string, style: pos as Record<string, string> }))
  stage.append(...corners)

  const sn = h('i', { text: 'S/N 0.00' })
  const capTop = h('div', { class: 'n-cap' }, h('span', { text: strings.plate }), h('span', { text: 'Fig. 01' }))
  const capBottom = h('div', { class: 'n-cap' }, h('b', { text: strings.name }), sn)
  const canvas = h('canvas')
  const frame = h('div', { class: 'n-frame' }, canvas)
  const plate = h('div', { class: 'n-plate' }, capTop, frame, capBottom)
  const tag = h('p', { class: 'n-tag' }, ...Array.from(strings.tagline, (ch) => h('span', { text: ch })))
  const center = h('div', { class: 'n-center' }, plate, tag)
  stage.append(center)

  corners.forEach((c, i) =>
    animate(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 150 + i * 60, easing: EASE.out })
  )
  animate(capTop, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 200 })
  animate(capBottom, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 320 })

  // Progressive plate: each resolution scans in over the previous one.
  const ctx = canvas.getContext('2d')!
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  let prev: HTMLCanvasElement | null = null
  loadImage(portrait)
    .then((img) => {
      if (s.dead) return
      const rect = frame.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.imageSmoothingEnabled = false
      STEPS.forEach((cell, i) => {
        s.at(260 + i * 300, () => {
          const cols = Math.ceil(rect.width / cell)
          const rows = Math.ceil(rect.height / cell)
          const next = paintBits(atkinson(sampleGrid(img, cols, rows, 0.8, 1.12)), cols, rows, C.bone, C.ink)
          const from = prev
          sound('blip')
          s.loop((t) => {
            const p = Math.min(1, t / 230)
            const y = p * canvas.height
            ctx.fillStyle = C.ink
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            if (from) ctx.drawImage(from, 0, 0, canvas.width, canvas.height)
            ctx.save()
            ctx.beginPath()
            ctx.rect(0, 0, canvas.width, y)
            ctx.clip()
            ctx.drawImage(next, 0, 0, canvas.width, canvas.height)
            ctx.restore()
            if (p < 1) {
              ctx.fillStyle = C.volt
              ctx.fillRect(0, y - dpr, canvas.width, 2 * dpr)
            }
            sn.textContent = `S/N ${((i + p) / STEPS.length).toFixed(2)}`
            if (p >= 1) prev = next
            return p < 1
          })
        })
      })
    })
    .catch(() => {})

  Array.from(tag.children).forEach((ch, i) =>
    animate(
      ch,
      [
        { opacity: 0, filter: 'blur(10px)', transform: 'translateY(.2em)' },
        { opacity: 1, filter: 'blur(0)', transform: 'none' },
      ],
      { duration: 700, delay: 980 + i * 26, easing: EASE.out }
    )
  )

  // Dissolve: the ink cover burns away through an ordered-dither threshold with a volt edge.
  const EXIT = 2250
  s.at(EXIT, () => {
    handoff()
    sound('whoosh')
    animate(center, [{ opacity: 1 }, { opacity: 0, transform: 'scale(.985)' }], { duration: 260, easing: 'ease-in' })
    corners.forEach((c) => animate(c, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }))
  })
  s.at(EXIT + 220, () => {
    const host = root.parentElement ?? root
    const cell = 10
    const cols = Math.ceil(window.innerWidth / cell)
    const rows = Math.ceil(window.innerHeight / cell)
    const cover = h('canvas', { class: 'n-dissolve' })
    cover.width = cols
    cover.height = rows
    const dctx = cover.getContext('2d')!
    const img = dctx.createImageData(cols, rows)
    const thresholds = new Float32Array(cols * rows)
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) thresholds[y * cols + x] = bayer(x & 7, y & 7) * 0.7 + Math.random() * 0.3
    root.append(cover)
    stage.style.background = 'transparent'
    grain.remove()
    host.style.background = 'transparent'
    s.loop((t) => {
      const p = Math.min(1, t / 720) * 1.08
      const d = img.data
      for (let i = 0; i < thresholds.length; i++) {
        const v = thresholds[i]
        const o = i * 4
        if (v < p - 0.08) {
          d[o + 3] = 0
        } else if (v < p) {
          d[o] = 204
          d[o + 1] = 255
          d[o + 2] = 0
          d[o + 3] = 255
        } else {
          d[o] = 10
          d[o + 1] = 10
          d[o + 2] = 11
          d[o + 3] = 255
        }
      }
      dctx.putImageData(img, 0, 0)
      if (p >= 1.08) {
        done()
        return false
      }
    })
  })

  return { destroy: () => s.kill() }
}

export default player
