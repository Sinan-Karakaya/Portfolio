/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        'bg-2': token('bg-2'),
        'bg-3': token('bg-3'),
        fg: token('fg'),
        muted: token('muted'),
        faint: token('faint'),
        volt: token('volt'),
        // Volt as a text colour where it stays legible: volt on Ink, ink on Bone.
        accent: token('accent'),
        signal: token('signal'),
        ink: token('ink'),
        bone: token('bone'),
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        dot: ['var(--font-dot)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        snap: 'var(--ease-snap)',
      },
      spacing: {
        gutter: 'var(--gutter)',
        hud: 'var(--hud-h)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
