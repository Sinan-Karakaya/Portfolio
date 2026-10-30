// The page "boots" once the startup animation (or a page transition) hands over.
// Reveal animations, decoders and the portrait wait for this moment.

export const BOOT_EVENT = 'sk:boot'

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

// Decides whether the intro plays and whether motion is allowed. Inlined in <head>
// so the server-rendered page never flashes. Self-contained on purpose: it is
// serialised with toString().
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
    if (d.dataset.boot !== 'ready') {
      d.dataset.motion = 'off'
      d.dataset.intro = 'off'
      d.dataset.boot = 'ready'
    }
  }, 7500)
}

export const bootScript = (variants: string[]) => `(${boot.toString()})(${JSON.stringify(variants)})`

// If a full client render replaced <html> and wiped boot()'s attributes, recover
// conservatively: no intro, no reveal choreography, everything visible.
export function ensureBooted() {
  const d = document.documentElement
  if (d.dataset.motion) return
  d.dataset.motion = 'off'
  d.dataset.intro = 'off'
  setBoot('ready')
}
