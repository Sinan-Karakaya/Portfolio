import { C, EASE, F, IntroPlayer, animate, fitSize, h, scheduler, style } from '../kit'

// 02 — ALL-OUT · Kinetic cut-in.
// Two slashed bands slam the name across the screen, the monogram stamps down
// with a shake, the role lands as ransom-note cut-outs, then the whole frame
// tears along the diagonal to reveal the site.

const CSS = `
.a-root{position:absolute;inset:0;background:${C.ink};overflow:hidden}
.a-band{position:absolute;left:-25vw;width:150vw;display:flex;align-items:center;overflow:hidden;transform:rotate(-7deg)}
.a-band.a1{top:4vh;height:42vh;background:${C.volt};justify-content:flex-start}
.a-band.a2{top:50vh;height:42vh;background:${C.bone};justify-content:flex-end}
.a-txt{font-family:${F.display};font-weight:900;font-stretch:125%;text-transform:uppercase;letter-spacing:-.02em;line-height:.8;color:${C.ink};
  white-space:nowrap;padding:0 calc(25vw + 3vw)}
.a-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.a-lines line{stroke:${C.ink};stroke-width:3;stroke-linecap:square}
.a-mark{position:absolute;left:50%;top:50%;width:min(34vmin,300px);height:min(34vmin,300px);margin:calc(min(34vmin,300px) / -2) 0 0 calc(min(34vmin,300px) / -2);
  transform:rotate(-7deg);filter:drop-shadow(1.2vmin 1.2vmin 0 ${C.ink})}
.a-mark svg{width:100%;height:100%;display:block;outline:min(1vmin,8px) solid ${C.ink}}
.a-cut{position:absolute;font-family:${F.display};font-weight:900;font-stretch:100%;text-transform:uppercase;letter-spacing:-.01em;
  font-size:clamp(20px,4.8vmin,56px);line-height:1;padding:.18em .38em .14em;white-space:nowrap;box-shadow:.12em .12em 0 ${C.ink}}
.a-cut.c1{background:${C.ink};color:${C.volt};box-shadow:.12em .12em 0 ${C.bone}}
.a-cut.c2{background:${C.signal};color:${C.ink}}
.a-tag{position:absolute;font:500 clamp(9px,1.3vmin,12px)/1 ${F.mono};font-stretch:87.5%;letter-spacing:.12em;text-transform:uppercase;
  background:${C.bone};color:${C.ink};padding:6px 8px 5px;white-space:nowrap}
.a-half{position:absolute;inset:0}
.a-seam{position:absolute;left:-10vw;width:120vw;height:3px;background:${C.volt};top:50%;transform:rotate(-7deg);transform-origin:center}
`

const MARK = [
  [1, 3, 5, 1],
  [1, 4, 1, 2],
  [1, 6, 5, 1],
  [5, 7, 1, 2],
  [1, 9, 5, 1],
  [8, 3, 1, 7],
  [12, 3, 1, 1],
  [11, 4, 1, 1],
  [10, 5, 1, 1],
  [9, 6, 1, 1],
  [10, 7, 1, 1],
  [11, 8, 1, 1],
  [12, 9, 1, 1],
]

const svg = (tag: string, attrs: Record<string, string | number>) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v))
  return el
}

const player: IntroPlayer = ({ root, strings, sound, handoff, done }) => {
  const s = scheduler()
  style(root, CSS)
  const stage = h('div', { class: 'a-root' })
  root.append(stage)

  const [first, ...rest] = strings.name.split(' ')
  const last = rest.join(' ')
  const size = Math.min(
    window.innerHeight * 0.34,
    fitSize(last, window.innerWidth * 0.94, {
      fontFamily: F.display,
      fontWeight: '900',
      fontStretch: '125%',
      textTransform: 'uppercase',
      letterSpacing: '-0.02em',
    })
  )
  const t1 = h('span', { class: 'a-txt', text: first, style: { fontSize: `${size}px` } })
  const t2 = h('span', { class: 'a-txt', text: last, style: { fontSize: `${size}px` } })
  const b1 = h('div', { class: 'a-band a1' }, t1)
  const b2 = h('div', { class: 'a-band a2' }, t2)
  stage.append(b1, b2)

  // Speed lines radiating from the centre.
  const lines = svg('svg', { class: 'a-lines', viewBox: '-50 -50 100 100', preserveAspectRatio: 'none' })
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2 + (i % 2) * 0.04
    const r0 = 9 + (i % 3) * 4
    lines.append(
      svg('line', {
        x1: Math.cos(a) * r0,
        y1: Math.sin(a) * r0,
        x2: Math.cos(a) * 80,
        y2: Math.sin(a) * 80,
        'vector-effect': 'non-scaling-stroke',
      })
    )
  }
  lines.style.opacity = '0'
  stage.append(lines)

  const markSvg = svg('svg', { viewBox: '0 0 14 14', 'shape-rendering': 'crispEdges' })
  markSvg.append(svg('rect', { width: 14, height: 14, fill: C.volt }))
  for (const [x, y, w, hh] of MARK) markSvg.append(svg('rect', { x, y, width: w, height: hh, fill: C.ink }))
  const mark = h('div', { class: 'a-mark', style: { opacity: '0' } }, markSvg)
  stage.append(mark)

  const words = strings.role.toUpperCase().split(' ')
  const cuts = words.map((w, i) =>
    h('span', {
      class: `a-cut ${i % 2 ? 'c2' : 'c1'}`,
      text: w,
      style: {
        left: i % 2 ? '52%' : 'auto',
        right: i % 2 ? 'auto' : '52%',
        top: i % 2 ? 'calc(50% + min(17vmin,150px) + 6vmin)' : 'calc(50% + min(17vmin,150px) + 2vmin)',
        transform: `rotate(${i % 2 ? 4 : -5}deg)`,
        opacity: '0',
      },
    })
  )
  const tag = h('span', {
    class: 'a-tag',
    text: `${strings.city} · ${new Date().getFullYear()}`,
    style: {
      left: 'calc(50% + min(10vmin,90px))',
      top: 'calc(50% - min(17vmin,150px) - 4vmin)',
      transform: 'rotate(6deg)',
      opacity: '0',
    },
  })
  stage.append(...cuts, tag)

  // ── beat 1: bands ─────────────────────────────────────────────────────────
  sound('whoosh')
  animate(b1, [{ transform: 'rotate(-7deg) translateX(-110%)' }, { transform: 'rotate(-7deg) translateX(0)' }], {
    duration: 320,
    easing: EASE.out,
  })
  animate(
    t1,
    [{ transform: 'translateX(30%)' }, { transform: 'translateX(0)', offset: 0.25 }, { transform: 'translateX(-4%)' }],
    {
      duration: 1500,
      easing: 'linear',
    }
  )
  s.at(130, () => sound('whoosh'))
  animate(b2, [{ transform: 'rotate(-7deg) translateX(110%)' }, { transform: 'rotate(-7deg) translateX(0)' }], {
    duration: 320,
    delay: 130,
    easing: EASE.out,
  })
  animate(
    t2,
    [{ transform: 'translateX(-30%)' }, { transform: 'translateX(0)', offset: 0.25 }, { transform: 'translateX(4%)' }],
    {
      duration: 1500,
      delay: 130,
      easing: 'linear',
    }
  )

  // ── beat 2: stamp ─────────────────────────────────────────────────────────
  s.at(640, () => {
    sound('thump')
    animate(
      mark,
      [
        { opacity: 0, transform: 'rotate(-20deg) scale(2.6)' },
        { opacity: 1, transform: 'rotate(-7deg) scale(1)' },
      ],
      {
        duration: 260,
        easing: EASE.back,
      }
    )
    animate(
      lines,
      [
        { opacity: 0, transform: 'scale(.6)' },
        { opacity: 1, transform: 'scale(1)', offset: 0.25 },
        { opacity: 0, transform: 'scale(1.15)' },
      ],
      {
        duration: 520,
        easing: EASE.out,
      }
    )
    animate(
      stage,
      [
        { transform: 'translate(0,0)' },
        { transform: 'translate(-12px,8px)' },
        { transform: 'translate(10px,-6px)' },
        { transform: 'translate(-6px,-4px)' },
        { transform: 'translate(4px,5px)' },
        { transform: 'translate(-2px,1px)' },
        { transform: 'translate(0,0)' },
      ],
      { duration: 300, delay: 120, easing: 'linear' }
    )
  })

  // ── beat 3: cut-outs ──────────────────────────────────────────────────────
  cuts.forEach((cut, i) =>
    s.at(900 + i * 120, () => {
      sound('select')
      const rot = i % 2 ? 4 : -5
      animate(
        cut,
        [
          { opacity: 0, transform: `rotate(${rot * 3}deg) scale(.3)` },
          { opacity: 1, transform: `rotate(${rot}deg) scale(1)` },
        ],
        {
          duration: 280,
          easing: EASE.back,
        }
      )
    })
  )
  s.at(1120, () =>
    animate(
      tag,
      [
        { opacity: 0, transform: 'rotate(6deg) translateY(10px)' },
        { opacity: 1, transform: 'rotate(6deg)' },
      ],
      { duration: 220, easing: EASE.out }
    )
  )

  // ── exit: tear along the diagonal ─────────────────────────────────────────
  s.at(1700, () => {
    handoff()
    sound('whoosh')
    stage.getAnimations({ subtree: true }).forEach((a) => {
      try {
        a.commitStyles()
      } catch {}
      a.cancel()
    })
    const host = root.parentElement ?? root
    host.style.background = 'transparent'
    const top = stage.cloneNode(true) as HTMLElement
    const bottom = stage
    top.classList.add('a-half')
    bottom.classList.add('a-half')
    // The tear follows the bands' -7° slant through the centre of the screen.
    const dy = Math.tan((7 * Math.PI) / 180) * 50 * (window.innerWidth / window.innerHeight)
    top.style.clipPath = `polygon(0 0, 100% 0, 100% ${50 - dy}%, 0 ${50 + dy}%)`
    bottom.style.clipPath = `polygon(0 ${50 + dy}%, 100% ${50 - dy}%, 100% 100%, 0 100%)`
    root.append(top)
    const seam = h('div', { class: 'a-seam' })
    root.append(seam)
    animate(
      seam,
      [
        { opacity: 1, transform: 'rotate(-7deg) scaleX(0)' },
        { opacity: 1, transform: 'rotate(-7deg) scaleX(1)', offset: 0.4 },
        { opacity: 0 },
      ],
      {
        duration: 360,
        easing: EASE.out,
      }
    )
    animate(top, [{ transform: 'none' }, { transform: 'translate(-8vw, -75vh) rotate(-2deg)' }], {
      duration: 640,
      delay: 90,
      easing: EASE.inOut,
    })
    animate(bottom, [{ transform: 'none' }, { transform: 'translate(8vw, 75vh) rotate(-2deg)' }], {
      duration: 640,
      delay: 90,
      easing: EASE.inOut,
    }).then(done)
  })

  return { destroy: () => s.kill() }
}

export default player
