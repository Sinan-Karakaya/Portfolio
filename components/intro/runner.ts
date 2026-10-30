import { C, EASE, F, IntroContext, IntroPlayer, IntroStrings, animate, h } from './kit'

type RunOptions = {
  root: HTMLElement
  player: IntroPlayer
  strings: IntroStrings
  portrait: string
  sound: IntroContext['sound']
  onHandoff: () => void
  onDone: () => void
}

const SKIP_CSS = `
.sk-intro-stage{position:absolute;inset:0;overflow:hidden}
.sk-intro-skip{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--gutter,24px) - 6px);z-index:20;display:flex;align-items:center;gap:10px;
  padding:9px 12px 8px;border:1px solid rgba(235,233,227,.28);background:rgba(10,10,11,.55);color:${C.bone};
  font:400 10.5px/1 ${F.mono};font-stretch:87.5%;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;
  transition:background .2s,color .2s,border-color .2s;backdrop-filter:blur(6px)}
.sk-intro-skip:hover,.sk-intro-skip:focus-visible{background:${C.volt};color:${C.ink};border-color:${C.volt};outline:none}
.sk-intro-skip kbd{font:inherit;padding:2px 4px;border:1px solid currentColor;opacity:.7}
`

// Plays one startup animation inside `root` and owns everything around it:
// the skip control, keyboard/pointer shortcuts and a clean exit.
export function runIntro({ root, player, strings, portrait, sound, onHandoff, onDone }: RunOptions) {
  root.getAnimations().forEach((a) => a.cancel())
  root.replaceChildren()
  root.removeAttribute('style')
  root.dataset.state = 'playing'

  const stage = h('div', { class: 'sk-intro-stage', attrs: { 'aria-hidden': 'true' } })
  const css = h('style', { text: SKIP_CSS })
  const skipButton = h(
    'button',
    { class: 'sk-intro-skip', attrs: { type: 'button' } },
    strings.skip,
    h('kbd', { text: 'Esc' })
  )
  root.append(css, stage, skipButton)

  let handedOff = false
  let finished = false
  const handoff = () => {
    if (handedOff) return
    handedOff = true
    onHandoff()
  }

  const teardown = () => {
    window.removeEventListener('keydown', onKey)
    root.removeEventListener('pointerdown', onPointer)
  }

  const finish = () => {
    if (finished) return
    finished = true
    handoff()
    teardown()
    handle.destroy()
    root.replaceChildren()
    root.dataset.state = 'done'
    onDone()
  }

  const skip = () => {
    if (finished || root.dataset.state === 'skipping') return
    root.dataset.state = 'skipping'
    sound('whoosh')
    handoff()
    animate(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: EASE.out }).then(finish)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (['Escape', 'Enter', ' ', 'Spacebar'].includes(e.key)) {
      e.preventDefault()
      skip()
    }
  }
  const onPointer = (e: PointerEvent) => {
    if (e.button === 0) skip()
  }

  window.addEventListener('keydown', onKey)
  root.addEventListener('pointerdown', onPointer)

  const handle = player({ root: stage, strings, portrait, sound, handoff, done: finish })

  return {
    skip,
    destroy() {
      if (finished) return
      finished = true
      teardown()
      handle.destroy()
      root.replaceChildren()
    },
  }
}
