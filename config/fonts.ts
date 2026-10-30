import localFont from 'next/font/local'

// All faces are self-hosted (SIL OFL, see styles/fonts/LICENSE-*.txt) so builds never depend on a font CDN.

// Archivo — variable grotesk with a width axis: condensed for headlines, expanded for labels and banners.
export const fontDisplay = localFont({
  src: '../styles/fonts/archivo-var.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-display',
  display: 'swap',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

// Instrument Serif — the classical voice, used sparingly for decks and pull quotes.
export const fontSerif = localFont({
  src: [
    { path: '../styles/fonts/instrument-serif-regular.woff2', weight: '400', style: 'normal' },
    { path: '../styles/fonts/instrument-serif-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

// Martian Mono — HUD labels, metadata and anything machine-like.
export const fontMono = localFont({
  src: '../styles/fonts/martian-mono-var.woff2',
  weight: '100 800',
  style: 'normal',
  variable: '--font-mono',
  display: 'swap',
  declarations: [{ prop: 'font-stretch', value: '75% 112.5%' }],
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})

// Doto — dot-matrix numerals for counters and years.
export const fontDot = localFont({
  src: '../styles/fonts/doto-var.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-dot',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
})

export const fontVariables = [fontDisplay.variable, fontSerif.variable, fontMono.variable, fontDot.variable].join(' ')
