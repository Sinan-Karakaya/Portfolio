import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { languages } from '@/app/i18n/settings'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', ...languages.flatMap((l) => [`/${l}/admin`, `/${l}/auth`])],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
