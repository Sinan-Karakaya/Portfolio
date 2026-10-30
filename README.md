# sinankarakaya.fr

Personal site of Sinan Karakaya, software engineer. Next.js 14 (app router), Tailwind CSS, Prisma/PostgreSQL for projects, NextAuth for the admin, i18next for English and French.

## SK/OS — the design system

A Swiss 12-column grid and HUD labels (Marathon), a classical serif and 1-bit imagery (Nous Research), and menu-grade motion (Atlus).

- **Editions**: `ink` (default) and `bone`, switched in the HUD. Colours are RGB-triplet CSS variables in `styles/globals.css`, exposed to Tailwind as `bg`, `fg`, `muted`, `volt`, `signal`…
- **Type**: Archivo (variable width: condensed for headlines, expanded for labels), Instrument Serif (decks), Martian Mono (HUD), Doto (dot-matrix numerals). All self-hosted from `styles/fonts` under the SIL OFL.
- **Portrait**: `components/Portrait.tsx` renders `public/assets/images/me-signal*.jpg` (background-suppressed studies of the photo) as a 1-bit Atkinson dither, an ASCII plate or the raw photo, with a HUD lens on hover.
- **Motion**: page transitions (`components/motion/Transition.tsx`), boot-gated reveals (`data-reveal` + `RevealObserver`), decoding labels, synthesised interface sounds (off by default). `prefers-reduced-motion` turns all of it off.
- Press **G** anywhere to overlay the grid.

## Startup animation

Four intros live in `components/intro/variants`: `post`, `allout`, `nous` and `lockon`. They are plain TypeScript (no React), so the same code can run outside the app.

- The default is `siteConfig.intro` in `config/site.ts`.
- Preview any of them with `?intro=post`, `?intro=allout`, `?intro=nous` or `?intro=lockon`; `?intro=off` disables it.
- It plays once per browser session, is skippable (Esc, Enter, Space, click), and never plays with reduced motion. "Replay intro" in the footer plays it again.

## Development

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL, NEXTAUTH_SECRET, ADMIN_*, CLOUD_*
pnpm prisma migrate deploy
pnpm dev
```

Pages read projects from the database and revalidate every 60 seconds. If the database can't be reached they render an "archive offline" state instead of failing.

Copy lives in `app/i18n/locales/{en,fr}/*.json`.

## License

MIT
