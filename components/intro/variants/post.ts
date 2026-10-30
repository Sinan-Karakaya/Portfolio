import { C, EASE, F, IntroPlayer, animate, fitSize, h, scheduler, scramble, style, typewrite } from '../kit'

// 01 — POST · Power-on self test.
// A boot log types itself out, a dot-matrix counter races to 100, the name lands
// with an RGB split, and the screen collapses like a CRT switching channels.

const CSS = `
.p-root{position:absolute;inset:0;background:${C.ink};color:${C.bone};--g:clamp(16px,2.4vw,36px)}
.p-head{position:absolute;left:var(--g);right:var(--g);top:var(--g);display:flex;justify-content:space-between;gap:24px;
  font:400 10.5px/1.5 ${F.mono};font-stretch:87.5%;letter-spacing:.05em;text-transform:uppercase}
.p-head span:last-child{color:${C.muted}}
.p-log{position:absolute;left:var(--g);top:calc(var(--g) + 44px);width:min(760px,calc(100% - 2 * var(--g)));
  font:400 clamp(10px,1.05vw,12.5px)/2 ${F.mono};font-stretch:87.5%;letter-spacing:.04em;text-transform:uppercase}
.p-line{display:flex;align-items:baseline;white-space:pre;opacity:0}
.p-line .t{color:${C.muted};margin-right:14px}
.p-line .lead{flex:1;margin:0 12px;border-bottom:1px dotted rgba(235,233,227,.22);transform:translateY(-4px);transform-origin:left;transform:translateY(-4px) scaleX(0)}
.p-line .s{color:${C.volt};min-width:6ch;text-align:right}
.p-count{position:absolute;right:var(--g);bottom:calc(var(--g) - .08em);font:900 min(24vw,320px)/.78 ${F.dot};letter-spacing:-.02em;color:${C.bone}}
.p-count small{display:block;font:400 10.5px/1 ${F.mono};letter-spacing:.06em;color:${C.muted};text-align:right;margin-bottom:14px;text-transform:uppercase}
.p-bar{position:absolute;left:var(--g);bottom:var(--g);display:flex;flex-direction:column;gap:10px}
.p-bar small{font:400 10.5px/1 ${F.mono};font-stretch:87.5%;letter-spacing:.06em;color:${C.muted};text-transform:uppercase}
.p-segs{display:flex;gap:3px}
.p-segs i{display:block;width:clamp(5px,.7vw,10px);height:14px;background:rgba(235,233,227,.12)}
.p-segs i.on{background:${C.volt}}
.p-name{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.p-name .w{position:relative;display:inline-block;font-family:${F.display};font-weight:900;font-stretch:125%;text-transform:uppercase;
  letter-spacing:-.015em;line-height:.84;white-space:nowrap}
.p-name .w b{position:absolute;inset:0;font:inherit;mix-blend-mode:screen}
.p-name .w b.r{color:${C.signal}} .p-name .w b.g{color:${C.volt}}
.p-name .w span{position:relative;color:${C.bone}}
@media (max-width:640px){.p-head span:last-child{display:none}.p-count{bottom:calc(var(--g) + 64px)}.p-bar{bottom:calc(var(--g) + 64px)}}
.p-role{margin-top:22px;font:400 11px/1 ${F.mono};font-stretch:87.5%;letter-spacing:.2em;text-transform:uppercase;color:${C.volt}}
`

const player: IntroPlayer = ({ root, strings, sound, handoff, done }) => {
  const s = scheduler()
  style(root, CSS)
  const stage = h('div', { class: 'p-root' })
  root.append(stage)

  const [headline, ...lines] = strings.post
  const now = new Date()
  const stamp = `${now.toISOString().slice(0, 10)} · ${now.toTimeString().slice(0, 8)}`
  const headText = h('span')
  stage.append(h('div', { class: 'p-head' }, headText, h('span', { text: stamp })))

  const log = h('div', { class: 'p-log' })
  stage.append(log)
  const statusFor = (i: number) =>
    i === lines.length - 1 ? strings.ready : /⇄/.test(lines[i]) ? strings.linked : strings.ok
  const rows = lines.map((text, i) => {
    const body = h('span')
    const lead = h('span', { class: 'lead' })
    const status = h('span', { class: 's' })
    const row = h(
      'div',
      { class: 'p-line' },
      h('span', { class: 't', text: `[${(0.012 + i * 0.137).toFixed(3)}]` }),
      body,
      lead,
      status
    )
    log.append(row)
    return { row, body, lead, status, text, done: statusFor(i) }
  })

  const segs = h('div', { class: 'p-segs' })
  const SEGMENTS = 40
  for (let i = 0; i < SEGMENTS; i++) segs.append(h('i'))
  stage.append(h('div', { class: 'p-bar' }, h('small', { text: 'portfolio.bin' }), segs))

  const counter = h('span', { text: '000' })
  stage.append(h('div', { class: 'p-count' }, h('small', { text: 'Load %' }), counter))

  const word = h('span', { text: strings.name })
  const wrap = h(
    'div',
    { class: 'w' },
    h('b', { class: 'r', text: strings.name }),
    h('b', { class: 'g', text: strings.name }),
    word
  )
  const role = h('div', { class: 'p-role', text: strings.role })
  const name = h('div', { class: 'p-name' }, wrap, role)
  stage.append(name)

  // ── timeline ──────────────────────────────────────────────────────────────
  typewrite(headText, headline, 9, s)

  rows.forEach((r, i) => {
    s.at(240 + i * 185, () => {
      r.row.style.opacity = '1'
      typewrite(r.body, r.text, 6, s, () => {
        animate(r.lead, [{ transform: 'translateY(-4px) scaleX(0)' }, { transform: 'translateY(-4px) scaleX(1)' }], {
          duration: 160,
          easing: EASE.out,
        })
        s.at(150, () => {
          r.status.textContent = r.done
          sound('blip')
        })
      })
    })
  })

  const LOAD = 1640
  s.loop((t) => {
    const p = Math.min(1, t / LOAD)
    const eased = 1 - Math.pow(1 - p, 2.2)
    counter.textContent = String(Math.round(eased * 100)).padStart(3, '0')
    const lit = Math.round(eased * SEGMENTS)
    segs.childNodes.forEach((seg, i) => (seg as HTMLElement).classList.toggle('on', i < lit))
    return p < 1
  })

  // Glitch the log away and land the name.
  s.at(LOAD + 60, () => {
    sound('thump')
    for (const el of [log, segs.parentElement!, counter.parentElement!, headText.parentElement!]) {
      animate(
        el,
        [
          { transform: 'none', opacity: 1 },
          { transform: 'translateX(-10px)', opacity: 1, offset: 0.2 },
          { transform: 'translateX(14px) skewX(-8deg)', opacity: 0.6, offset: 0.45 },
          { transform: 'translateX(-4px)', opacity: 0.3, offset: 0.7 },
          { transform: 'none', opacity: 0 },
        ],
        { duration: 220, easing: 'steps(5, end)' }
      )
    }
    const wide = window.innerWidth > window.innerHeight * 0.9
    const size = fitSize(strings.name, window.innerWidth * (wide ? 0.9 : 0.94), {
      fontFamily: F.display,
      fontWeight: '900',
      fontStretch: '125%',
      textTransform: 'uppercase',
      letterSpacing: '-0.015em',
    })
    wrap.style.fontSize = `${Math.min(size, window.innerHeight * 0.3)}px`
    name.style.opacity = '1'
    const [r, g] = Array.from(wrap.querySelectorAll('b'))
    // The split channels converge, then drop out so the name settles on bone.
    animate(
      r,
      [
        { transform: 'translate(-14px, 3px)' },
        { transform: 'translate(6px,-2px)', opacity: 1, offset: 0.6 },
        { transform: 'none', opacity: 0 },
      ],
      {
        duration: 460,
        easing: 'steps(6, end)',
      }
    )
    animate(
      g,
      [
        { transform: 'translate(12px, -3px)' },
        { transform: 'translate(-5px,2px)', opacity: 1, offset: 0.6 },
        { transform: 'none', opacity: 0 },
      ],
      {
        duration: 460,
        easing: 'steps(6, end)',
      }
    )
    animate(
      word,
      [
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 40% 0)', transform: 'translateX(8px)', offset: 0.3 },
        { clipPath: 'inset(30% 0 0 0)', transform: 'translateX(-6px)', offset: 0.55 },
        { clipPath: 'inset(0 0 0 0)', transform: 'none' },
      ],
      { duration: 360, easing: 'steps(4, end)' }
    )
    scramble(role, strings.role, 520, s)
  })

  // CRT collapse into the page.
  const EXIT = LOAD + 820
  s.at(EXIT, () => {
    handoff()
    sound('whoosh')
    const host = root.parentElement ?? root
    animate(name, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, delay: 60, easing: 'ease-in' })
    animate(
      stage,
      [{ backgroundColor: C.ink }, { backgroundColor: C.bone, offset: 0.45 }, { backgroundColor: C.bone }],
      {
        duration: 520,
        easing: EASE.inOut,
      }
    )
    animate(
      host,
      [{ transform: 'scale(1, 1)' }, { transform: 'scale(1, .006)', offset: 0.5 }, { transform: 'scale(0, .006)' }],
      {
        duration: 520,
        easing: EASE.inOut,
      }
    ).then(done)
  })

  return { destroy: () => s.kill() }
}

export default player
