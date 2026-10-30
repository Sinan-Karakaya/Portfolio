import { languages } from '@/app/i18n/settings'

export type SiteConfig = typeof siteConfig

export type IntroVariant = 'post' | 'allout' | 'nous' | 'lockon'

export const siteConfig = {
  name: 'Sinan Karakaya',
  description: "Sinan Karakaya's personal website, software engineer.",
  url: 'https://sinankarakaya.fr',
  navItems: [
    { label: 'home', href: '' },
    { label: 'about', href: '/about' },
    { label: 'projects', href: '/projects' },
    { label: 'contact', href: '/contact' },
  ],
  links: {
    github: 'https://github.com/Sinan-Karakaya',
    linkedin: 'https://www.linkedin.com/in/sinan-karakaya-a9355b228/',
  },
  contact: {
    email: 'karakaya.sinan@proton.me',
    phone: '+33 7 81 98 47 83',
    phoneHref: 'tel:+33781984783',
  },
  location: {
    city: 'Rennes',
    country: 'FR',
    coordinates: '48.1173°N 1.6778°W',
    timeZone: 'Europe/Paris',
  },
  // Startup animation played once per session. Preview any variant with ?intro=<variant>.
  intro: 'lockon' as IntroVariant,
  introVariants: ['post', 'allout', 'nous', 'lockon'] as IntroVariant[],
  stack: [
    'C',
    'C++',
    'CUDA',
    'Python',
    'TypeScript',
    'React',
    'Next.js',
    'React Native',
    'Flutter',
    'Go',
    'Docker',
    'Linux',
    'LLMs',
  ],
  openGraph: {
    image: '/assets/images/me.webp',
  },
}

export const localePath = (lng: string, href = '') => `/${lng}${href}`

// Canonical URL and hreflang alternates for one page in every language.
export const alternates = (lng: string, path = '') => ({
  canonical: `/${lng}${path}`,
  languages: Object.fromEntries(languages.map((l) => [l, `/${l}${path}`])),
})
