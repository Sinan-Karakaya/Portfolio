import { getTranslation, useTranslation } from '@/app/i18n'
import { localePath, siteConfig } from '@/config/site'
import Mark from '@/components/ui/Mark'
import { Link } from '@/components/motion/Transition'
import NavLinks, { NavItem } from './NavLinks'
import MobileMenu from './MobileMenu'
import { Clock, LangSwitch, SoundToggle, ThemeToggle } from './Controls'

export async function navItems(lng: string): Promise<NavItem[]> {
  const { t } = await getTranslation(lng, 'common')
  return siteConfig.navItems.map((item, i) => ({
    href: localePath(lng, item.href),
    label: t(`nav.${item.label}`),
    index: String(i + 1).padStart(2, '0'),
  }))
}

export default async function Hud({ lng }: { lng: string }) {
  const { t } = await useTranslation(lng, 'common')
  const items = await navItems(lng)
  const home = localePath(lng)
  const theme = { label: t('theme.label'), ink: t('theme.ink'), bone: t('theme.bone') }
  const sound = { label: t('sound.label'), on: t('sound.on'), off: t('sound.off') }
  const clock = (
    <Clock
      timeZone={siteConfig.location.timeZone}
      code='RNS'
      label={t('localTime')}
    />
  )

  return (
    <header className='fixed inset-x-0 top-0 z-[60] h-hud border-b border-line bg-bg/85 backdrop-blur-md'>
      <div className='gutter grid h-full grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]'>
        <Link
          href={home}
          label={siteConfig.name}
          className='group flex items-center gap-3 justify-self-start'
        >
          <Mark className='transition-transform duration-500 ease-out group-hover:-rotate-90' />
          <span className='label whitespace-nowrap'>
            {siteConfig.name}
            <span className='hidden text-muted 2xl:inline'> / {t('role')}</span>
          </span>
        </Link>

        <nav
          aria-label='Primary'
          className='hidden lg:block'
        >
          <NavLinks
            items={items}
            home={home}
          />
        </nav>

        <div className='flex items-center justify-end gap-5'>
          <div className='hidden items-center gap-5 lg:flex'>
            <LangSwitch
              lng={lng}
              label={t('language')}
            />
            <ThemeToggle labels={theme} />
            <SoundToggle labels={sound} />
            <span className='hidden xl:flex'>{clock}</span>
          </div>
          <div className='lg:hidden'>
            <MobileMenu
              items={items}
              home={home}
              labels={{ menu: t('menu'), close: t('close') }}
            >
              <LangSwitch
                lng={lng}
                label={t('language')}
              />
              <ThemeToggle labels={theme} />
              <SoundToggle labels={sound} />
              {clock}
            </MobileMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
