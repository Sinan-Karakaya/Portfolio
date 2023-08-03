import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'
import { link as linkStyles } from '@nextui-org/theme'
import { siteConfig } from '@/config/site'
import NextLink from 'next/link'
import clsx from 'clsx'
import { ThemeSwitch } from '@/components/theme-switch'
import { GithubIcon } from '@/components/icons'
import { Logo } from '@/components/icons'

import { useTranslation } from '@/app/i18n'

export default async function Navbar() {
	const { t } = await useTranslation('fr', 'navbar')

  return (
    <NextUINavbar
      maxWidth='xl'
      position='sticky'
    >
      <NavbarContent
        className='basis-1/5 sm:basis-full'
        justify='start'
      >
        <NavbarBrand
          as='li'
          className='gap-3 max-w-fit'
        >
          <NextLink
            className='flex justify-start items-center gap-1'
            href='/'
          >
            <Logo />
            <p className='font-bold text-inherit'>Sinan Karakaya</p>
          </NextLink>
        </NavbarBrand>
        <ul className='hidden sm:flex gap-4 justify-start ml-2'>
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color='foreground'
                href={item.href}
                isBlock
              >
                {t(item.label)}
              </Link>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='hidden sm:flex gap-2'>
          <Link
            isExternal
            href={siteConfig.links.github}
            aria-label='Github'
          >
            <GithubIcon className='text-default-500' />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className='hidden sm:flex'>
          <Button
            as={Link}
            href='/contact'
            variant='shadow'
            color='secondary'
          >
            {t('contact')}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className='sm:hidden basis-1 pl-4'
        justify='end'
      >
        <Link
          isExternal
          href={siteConfig.links.github}
          aria-label='Github'
        >
          <GithubIcon className='text-default-500' />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color='foreground'
                href={item.href}
                size='lg'
              >
                {t(item.label)}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem key={'coucou'}>
            <Link
              color='primary'
              size='lg'
              href='/contact'
            >
            	{t('contact')}
            </Link>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  )
}