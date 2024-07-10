import '@/styles/globals.css'
import { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { fontSans } from '@/config/fonts'
import { Providers } from './providers'
import Navbar from '@/components/navbar'
import clsx from 'clsx'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    images: [
      siteConfig.openGraph.image,
    ],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode
  params: { lng: string }
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers>
          <div className='relative flex flex-col h-screen'>
            <Navbar lng={lng} />
            <main className='flex justify-center items-start md:items-center h-full px-6'>{children}</main>
          </div>
        </Providers>
				<SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
