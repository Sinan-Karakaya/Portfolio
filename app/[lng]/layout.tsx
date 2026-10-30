import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { alternates, siteConfig } from '@/config/site'
import { fontVariables } from '@/config/fonts'
import { getTranslation, useTranslation } from '@/app/i18n'
import { languages } from '@/app/i18n/settings'
import { Providers } from './providers'
import Hud from '@/components/chrome/Hud'
import Footer from '@/components/chrome/Footer'
import Frame from '@/components/chrome/Frame'
import Intro from '@/components/intro/Intro'
import RevealObserver from '@/components/motion/RevealObserver'
import { TransitionProvider } from '@/components/motion/Transition'
import { bootScript } from '@/components/motion/boot'
import BootGuard from '@/components/motion/BootGuard'

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await getTranslation(lng, 'home')
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${t('deck').split(' — ')[0]}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: t('deck'),
    alternates: alternates(lng),
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: lng === 'fr' ? 'fr_FR' : 'en_GB',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark light',
}

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'common')

  return (
    <html
      lang={lng}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript(siteConfig.introVariants) }} />
      </head>
      <body className={fontVariables}>
        <BootGuard />
        <div
          id='sk-intro'
          aria-hidden='true'
        >
          <span className='sk-intro-cursor' />
        </div>
        <Providers>
          <TransitionProvider loadingLabel={t('intro.loading')}>
            <a
              href='#main'
              className='label fixed left-3 top-3 z-[120] -translate-y-24 bg-volt px-3 py-2 text-ink focus:translate-y-0'
            >
              {t('skip')}
            </a>
            <Hud lng={lng} />
            <main
              id='main'
              className='relative pt-hud'
            >
              {children}
            </main>
            <Footer lng={lng} />
            <Frame rail={`${siteConfig.name} — ${t('role')} — ${siteConfig.location.coordinates}`} />
            <RevealObserver />
            <Intro
              lng={lng}
              variant={siteConfig.intro}
              strings={{
                name: siteConfig.name,
                role: t('role'),
                skip: t('intro.skip'),
                post: t('intro.post', { returnObjects: true }) as string[],
                ok: t('intro.ok'),
                linked: t('intro.linked'),
                ready: t('intro.ready'),
                acquired: t('intro.acquired'),
                tagline: t('intro.tagline'),
                plate: t('intro.plate'),
                coordinates: siteConfig.location.coordinates,
                city: `${siteConfig.location.city}, ${siteConfig.location.country}`,
                stamps: t('intro.stamps', { returnObjects: true }) as Record<string, string>,
                online: t('online'),
              }}
            />
          </TransitionProvider>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
