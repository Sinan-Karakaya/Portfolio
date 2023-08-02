export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Sinan Karakaya',
  description: "Sinan Karakaya's personal website, software engineer.",
  navItems: [
    {
      label: 'home',
      href: '/',
    },
    {
      label: 'about',
      href: '/about',
    },
    {
      label: 'projects',
      href: '/projects',
    },
  ],
  links: {
    github: 'https://github.com/Sinan-Karakaya',
  },
}
