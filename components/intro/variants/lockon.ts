import { C, EASE, F, IntroPlayer, animate, fitSize, h, scheduler, scramble, style } from '../kit'

// 04 — LOCK-ON · Signal acquired.
// A crosshair splits the dark, the site's own 12-column grid draws itself, a
// reticle closes in and locks, and the name cycles through typefaces before it
// settles. Then the background drops away and the grid hands over to the page.

const CSS = `
.l-root{position:absolute;inset:0;background:${C.ink};color:${C.bone};--g:clamp(16px,2.4vw,36px);--cg:clamp(12px,1.4vw,20px)}
.l-hair{position:absolute;background:rgba(235,233,227,.32)}
.l-hair.x{left:0;right:0;top:50%;height:1px}
.l-hair.y{top:0;bottom:0;left:50%;width:1px}
.l-grid{position:absolute;inset:0 var(--g);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--cg)}
.l-grid i{display:block;border-left:1px solid rgba(235,233,227,.09);border-right:1px solid rgba(235,233,227,.09);transform-origin:50% 50%}
.l-rows{position:absolute;inset:0}
.l-rows i{position:absolute;left:0;right:0;height:1px;background:rgba(235,233,227,.06);transform-origin:50% 50%}
.l-label{position:absolute;font:400 10.5px/1.4 ${F.mono};font-stretch:87.5%;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.l-muted{color:${C.muted}}
.l-brk{position:absolute;width:28px;height:28px;border:0 solid ${C.volt}}
.l-brk.tl{border-left-width:2px;border-top-width:2px}
.l-brk.tr{border-right-width:2px;border-top-width:2px}
.l-brk.bl{border-left-width:2px;border-bottom-width:2px}
.l-brk.br{border-right-width:2px;border-bottom-width:2px}
.l-box{position:absolute;outline:1px solid rgba(204,255,0,0);transition:outline-color .2s}
.l-chip{position:absolute;font:500 10.5px/1 ${F.mono};font-stretch:87.5%;letter-spacing:.08em;text-transform:uppercase;background:${C.volt};color:${C.ink};
  padding:6px 8px 5px;white-space:nowrap;clip-path:inset(0 100% 0 0)}
.l-name{position:absolute;left:0;right:0;display:flex;justify-content:center;white-space:nowrap;line-height:.84;text-transform:uppercase}
.l-name span{display:inline-block;text-align:center;letter-spacing:-.015em;color:${C.bone}}
.l-cross{position:absolute;width:11px;height:11px}
.l-cross::before,.l-cross::after{content:'';position:absolute;background:${C.bone}}
.l-cross::before{left:5px;top:0;width:1px;height:11px}
.l-cross::after{top:5px;left:0;height:1px;width:11px}
.l-year{position:absolute;right:var(--g);bottom:calc(var(--g) - .1em);font:900 min(13vw,180px)/.78 ${F.dot};color:rgba(235,233,227,.16)}
@media (max-width:640px){.l-year{bottom:calc(var(--g) + 52px)}}
.l-flash{position:absolute;inset:0;background:${C.volt};opacity:0;pointer-events:none}
`

// The typefaces each letter flickers through before locking.
const FACES: Partial<CSSStyleDeclaration>[] = [
  { fontFamily: F.serif, fontStyle: 'italic', fontWeight: '400', fontStretch: '100%' },
  { fontFamily: F.mono, fontStyle: 'normal', fontWeight: '700', fontStretch: '75%' },
  { fontFamily: F.dot, fontStyle: 'normal', fontWeight: '900', fontStretch: '100%' },
  { fontFamily: F.display, fontStyle: 'normal', fontWeight: '300', fontStretch: '62%' },
  { fontFamily: F.display, fontStyle: 'normal', fontWeight: '900', fontStretch: '62%' },
  { fontFamily: F.serif, fontStyle: 'normal', fontWeight: '400', fontStretch: '100%' },
]
const FINAL: Partial<CSSStyleDeclaration> = {
  fontFamily: F.display,
  fontStyle: 'normal',
  fontWeight: '900',
  fontStretch: '125%',
}
const STAGGER = 40

const player: IntroPlayer = ({ root, strings, sound, handoff, done }) => {
  const s = scheduler()
  style(root, CSS)
  const stage = h('div', { class: 'l-root' })
  root.append(stage)
  const W = window.innerWidth
  const H = window.innerHeight

  // Crosshair + grid.
  const hx = h('i', { class: 'l-hair x' })
  const hy = h('i', { class: 'l-hair y' })
  const cols = h('div', { class: 'l-grid' }, ...Array.from({ length: 12 }, () => h('i')))
  const rows = h(
    'div',
    { class: 'l-rows' },
    ...Array.from({ length: 5 }, (_, i) => h('i', { style: { top: `${((i + 1) * 100) / 6}%` } }))
  )
  stage.append(cols, rows, hx, hy)

  animate(hx, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 420, easing: EASE.out })
  animate(hy, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 420, delay: 60, easing: EASE.out })
  Array.from(cols.children).forEach((c, i) =>
    animate(
      c,
      [
        { transform: 'scaleY(0)', opacity: 0 },
        { transform: 'scaleY(1)', opacity: 1 },
      ],
      {
        duration: 520,
        delay: 160 + Math.abs(i - 5.5) * 34,
        easing: EASE.out,
      }
    )
  )
  Array.from(rows.children).forEach((r, i) =>
    animate(r, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: 600,
      delay: 220 + Math.abs(i - 2) * 50,
      easing: EASE.out,
    })
  )

  // Name geometry: one line when there is room, two otherwise.
  const twoLines = W < H * 0.9
  const lines = twoLines ? strings.name.split(' ') : [strings.name]
  const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b))
  const size = Math.min(
    H * (twoLines ? 0.13 : 0.2),
    fitSize(longest, W * (twoLines ? 0.86 : 0.8), { ...FINAL, textTransform: 'uppercase', letterSpacing: '-0.015em' })
  )
  const lineH = size * 0.84
  // fitSize(text, 1) is the size at which the text is 1px wide, so width = size / that.
  const textW = size / fitSize(longest, 1, { ...FINAL, textTransform: 'uppercase', letterSpacing: '-0.015em' })
  const boxW = Math.min(W - 24, textW + size * 0.9)
  const boxH = lineH * lines.length + size * 0.55
  const box = { x: (W - boxW) / 2, y: (H - boxH) / 2, w: boxW, h: boxH }

  const letters: { el: HTMLElement; ch: string }[] = []
  lines.forEach((line, li) => {
    const row = h('div', {
      class: 'l-name',
      style: { top: `${box.y + size * 0.275 + li * lineH}px`, fontSize: `${size}px` },
    })
    for (const ch of line) {
      const el = h('span', { text: ch === ' ' ? ' ' : ch, style: { ...FINAL, opacity: '0' } })
      row.append(el)
      letters.push({ el, ch })
    }
    stage.append(row)
  })
  // Freeze each cell at its final width so the face-cycling never shifts the line.
  requestAnimationFrame(() => letters.forEach(({ el }) => (el.style.width = `${el.getBoundingClientRect().width}px`)))

  // Reticle.
  const frame = h('div', {
    class: 'l-box',
    style: { left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` },
  })
  stage.append(frame)
  const inset = Math.min(W, H) * 0.04
  const brackets = (
    [
      ['tl', inset, inset, box.x - 6, box.y - 6],
      ['tr', W - inset - 28, inset, box.x + box.w - 22, box.y - 6],
      ['bl', inset, H - inset - 28, box.x - 6, box.y + box.h - 22],
      ['br', W - inset - 28, H - inset - 28, box.x + box.w - 22, box.y + box.h - 22],
    ] as const
  ).map(([k, x0, y0, x1, y1]) => {
    const el = h('i', { class: `l-brk ${k}`, style: { left: '0px', top: '0px' } })
    stage.append(el)
    animate(
      el,
      [
        { transform: `translate(${x0}px,${y0}px)`, opacity: 0 },
        { transform: `translate(${x0}px,${y0}px)`, opacity: 1, offset: 0.15 },
        {
          transform: `translate(${x1 + (k.includes('l') ? -10 : 10)}px,${y1 + (k.includes('t') ? -10 : 10)}px)`,
          offset: 0.82,
        },
        { transform: `translate(${x1}px,${y1}px)`, opacity: 1 },
      ],
      { duration: 820, delay: 200, easing: EASE.out }
    )
    return el
  })

  // Telemetry around the target.
  const tl = h('span', {
    class: 'l-label',
    text: 'SK—01 / TRACK',
    style: { left: `${box.x}px`, top: `${box.y - 40}px` },
  })
  const coord = h('span', {
    class: 'l-label l-muted',
    text: strings.coordinates,
    style: { left: `${box.x}px`, top: `${box.y - 24}px` },
  })
  const zoom = h('span', {
    class: 'l-label',
    text: '×1.00',
    style: { right: `${W - box.x - box.w}px`, top: `${box.y - 24}px` },
  })
  const st = strings.stamps
  const cls = h('span', {
    class: 'l-label l-muted',
    text: `${st.class} — ${strings.role}`,
    style: { left: `${box.x}px`, top: `${box.y + box.h + 14}px` },
  })
  const org = h('span', {
    class: 'l-label l-muted',
    text: `${st.origin} — ${strings.city}`,
    style: { right: `${W - box.x - box.w}px`, top: `${box.y + box.h + 14}px` },
  })
  const chip = h('span', {
    class: 'l-chip',
    text: strings.acquired,
    style: { left: `${box.x}px`, top: `${box.y + box.h + 34}px` },
  })
  const telemetry = [tl, coord, zoom, cls, org]
  telemetry.forEach((el) => (el.style.opacity = '0'))
  stage.append(...telemetry, chip)

  // Crop marks and corner stamps.
  const crosses = [
    [box.x - 5, box.y - 5],
    [box.x + box.w - 6, box.y - 5],
    [box.x - 5, box.y + box.h - 6],
    [box.x + box.w - 6, box.y + box.h - 6],
  ].map(([x, y]) => h('i', { class: 'l-cross', style: { left: `${x}px`, top: `${y}px`, opacity: '0' } }))
  const corner = (text: string, pos: Record<string, string>, muted = true) =>
    h('span', { class: `l-label${muted ? ' l-muted' : ''}`, text, style: { ...pos, opacity: '0' } })
  const year = h('span', { class: 'l-year', text: String(new Date().getFullYear()), style: { opacity: '0' } })
  const stamps = [
    corner('SK / OS', { left: 'var(--g)', top: 'var(--g)' }, false),
    corner(`${st.id} SK-${new Date().getFullYear()}`, { right: 'var(--g)', top: 'var(--g)' }),
    corner(`${st.status} — ${strings.online}`, { left: 'var(--g)', bottom: 'var(--g)' }),
  ]
  stage.append(...crosses, ...stamps, year)

  s.at(240, () => {
    sound('tick')
    stamps.forEach((el, i) => s.at(i * 80, () => animate(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 })))
    animate(
      year,
      [
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 700, easing: EASE.out }
    )
  })
  s.at(420, () => {
    telemetry.forEach((el, i) =>
      s.at(i * 70, () => {
        el.style.opacity = '1'
        scramble(el, el.textContent ?? '', 420, s)
      })
    )
    s.loop((t) => {
      const p = Math.min(1, t / 600)
      zoom.textContent = `×${(1 + 3 * (1 - Math.pow(1 - p, 3))).toFixed(2)}`
      return p < 1
    })
  })

  // Lock.
  const LOCK = 1020
  s.at(LOCK, () => {
    sound('confirm')
    frame.style.outlineColor = 'rgba(204,255,0,.55)'
    s.at(140, () => (frame.style.outlineColor = 'rgba(204,255,0,.18)'))
    crosses.forEach((c) =>
      animate(
        c,
        [
          { opacity: 0, transform: 'scale(2)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 260, easing: EASE.out }
      )
    )
    brackets.forEach((b) =>
      animate(b, [{ filter: 'brightness(1)' }, { filter: 'brightness(2)', offset: 0.3 }, { filter: 'brightness(1)' }], {
        duration: 300,
      })
    )
    animate(chip, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
      duration: 360,
      easing: EASE.inOut,
    })
  })

  // Letters cycle through faces, then lock left to right.
  letters.forEach(({ el, ch }, i) => {
    if (ch === ' ') return
    const startAt = LOCK - 280 + i * 22
    const lockAt = LOCK + 80 + i * STAGGER
    s.at(startAt, () => {
      el.style.opacity = '1'
      el.style.color = C.volt
      let k = (i * 2) % FACES.length
      let frame = 0
      s.loop(() => {
        if (el.dataset.locked === '1') {
          Object.assign(el.style, FINAL)
          el.style.color = C.bone
          return false
        }
        if (frame++ % 3 === 0) Object.assign(el.style, FACES[k++ % FACES.length])
      })
    })
    s.at(lockAt, () => {
      el.dataset.locked = '1'
      if (i % 3 === 0) sound('tick')
    })
  })

  // Exit: flash, drop the background, leave the grid on top of the page for a beat.
  const EXIT = LOCK + 80 + letters.length * STAGGER + 380
  s.at(EXIT, () => {
    handoff()
    sound('whoosh')
    const flash = h('i', { class: 'l-flash' })
    stage.append(flash)
    animate(flash, [{ opacity: 0 }, { opacity: 0.45, offset: 0.3 }, { opacity: 0 }], {
      duration: 180,
      easing: 'linear',
    })
    const host = root.parentElement ?? root
    host.style.background = 'transparent'
    animate(stage, [{ backgroundColor: C.ink }, { backgroundColor: 'rgba(10,10,11,0)' }], {
      duration: 520,
      delay: 80,
      easing: EASE.out,
    })
    const fg = [
      ...brackets,
      ...telemetry,
      chip,
      ...crosses,
      ...stamps,
      year,
      frame,
      hx,
      hy,
      ...Array.from(stage.querySelectorAll('.l-name')),
    ]
    fg.forEach((el) => animate(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 60, easing: 'ease-in' }))
    Array.from(cols.children).forEach((c, i) =>
      animate(
        c,
        [
          { opacity: 1, transform: 'scaleY(1)' },
          { opacity: 0, transform: 'scaleY(1.04)' },
        ],
        {
          duration: 520,
          delay: 300 + Math.abs(i - 5.5) * 40,
          easing: EASE.out,
        }
      )
    )
    Array.from(rows.children).forEach((r) =>
      animate(r, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 260 })
    )
    s.at(1060, done)
  })

  return { destroy: () => s.kill() }
}

export default player
