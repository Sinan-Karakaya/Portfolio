// The page "boots" once the startup animation (or a page transition) hands over.
// Reveal animations, decoders and the portrait wait for this moment.

export const BOOT_EVENT = 'sk:boot'

const KEYS = ['motion', 'intro', 'boot'] as const
type BootKey = (typeof KEYS)[number]

export const isBootReady = () => typeof document !== 'undefined' && document.documentElement.dataset.boot === 'ready'

export const motionEnabled = () => typeof document !== 'undefined' && document.documentElement.dataset.motion === 'on'

export function setBoot(state: 'pending' | 'ready') {
  const html = document.documentElement
  if (html.dataset.boot === state) return
  html.dataset.boot = state
  if (state === 'ready') window.dispatchEvent(new Event(BOOT_EVENT))
}

export function onBootReady(cb: () => void) {
  if (isBootReady()) {
    cb()
    return () => {}
  }
  const handler = () => {
    window.removeEventListener(BOOT_EVENT, handler)
    cb()
  }
  window.addEventListener(BOOT_EVENT, handler)
  return () => window.removeEventListener(BOOT_EVENT, handler)
}

// React clears <html>'s attributes when the root layout remounts (switching
// language does that), so the client keeps the last values it saw to put back.
const snapshot: Partial<Record<BootKey, string>> = {}

if (typeof document !== 'undefined') {
  const d = document.documentElement
  const take = () =>
    KEYS.forEach((k) => {
      const value = d.dataset[k]
      if (value) snapshot[k] = value
    })
  take()
  new MutationObserver(take).observe(d, { attributes: true, attributeFilter: KEYS.map((k) => `data-${k}`) })
}

// Called first thing after every (re)mount of the layout, before other effects read the attributes.
export function restoreBoot() {
  const d = document.documentElement
  ;(window as unknown as { __skBooted?: boolean }).__skBooted = true
  if (d.dataset.motion || !snapshot.motion) return
  KEYS.forEach((k) => {
    const value = snapshot[k]
    if (value) d.dataset[k] = value
  })
}

// Decides whether the intro plays and whether motion is allowed. Inlined in <head>
// so the server-rendered page never flashes. Self-contained on purpose: it is
// serialised with toString(). The failsafe only fires if the client never boots.
export function boot(variants: string[]) {
  var d = document.documentElement
  var q: string | null = null
  var seen = false
  try {
    q = new URLSearchParams(location.search).get('intro')
  } catch (e) {}
  try {
    seen = sessionStorage.getItem('sk:intro') === '1'
  } catch (e) {}
  var reduce = !!window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
  var forced = !!q && variants.concat(['replay']).indexOf(q) > -1
  var play = !reduce && q !== 'off' && (forced || !seen)
  d.dataset.motion = reduce ? 'off' : 'on'
  d.dataset.intro = play ? 'on' : 'off'
  d.dataset.boot = play ? 'pending' : 'ready'
  setTimeout(function () {
    if ((window as unknown as { __skBooted?: boolean }).__skBooted || d.dataset.boot === 'ready') return
    d.dataset.motion = 'off'
    d.dataset.intro = 'off'
    d.dataset.boot = 'ready'
    window.dispatchEvent(new Event('sk:boot'))
  }, 7500)
}

export const bootScript = (variants: string[]) => `(${boot.toString()})(${JSON.stringify(variants)})`

// Last resort when boot() never ran (e.g. a framework error document): no intro,
// no reveal choreography, everything visible.
export function ensureBooted() {
  const d = document.documentElement
  if (d.dataset.motion) return
  d.dataset.motion = 'off'
  d.dataset.intro = 'off'
  setBoot('ready')
}
