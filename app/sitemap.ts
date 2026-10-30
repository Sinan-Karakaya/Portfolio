import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { languages } from '@/app/i18n/settings'
import { getProjects } from '@/app/lib/projects'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await getProjects('en')) ?? []
  const paths = ['', '/about', '/projects', '/contact', ...projects.map((p) => `/projects/${p.id}`)]
  return paths.flatMap((path) => languages.map((lng) => ({ url: `${siteConfig.url}/${lng}${path}` })))
}
