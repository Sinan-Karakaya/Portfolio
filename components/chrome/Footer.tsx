import { useTranslation } from '@/app/i18n'
import { siteConfig } from '@/config/site'
import { ArrowUpRight } from '@/components/icons'
import { Link } from '@/components/motion/Transition'
import Decode from '@/components/motion/Decode'
import Barcode from '@/components/ui/Barcode'
import { navItems } from './Hud'
import { BackToTop, CopyEmail, ReplayIntro } from './FooterActions'

export default async function Footer({ lng }: { lng: string }) {
  const { t } = await useTranslation(lng, 'common')
  const items = await navItems(lng)
  const year = new Date().getFullYear()
  const external = [
    { href: siteConfig.links.github, label: 'GitHub' },
    { href: siteConfig.links.linkedin, label: 'LinkedIn' },
    { href: `/assets/SinanKarakaya_CV_${lng}.pdf`, label: t('footer.resume') },
  ]

  return (
    <footer className='relative mt-[14vh] overflow-hidden border-t border-line'>
      <section className='gutter grid-12 gap-y-8 pb-[8vh] pt-[10vh]'>
        <div className='col-span-12'>
          <Decode
            text={`§ — ${t('footer.cta')}`}
            className='label mb-6 block text-muted'
          />
          <h2
            data-reveal='mask'
            className='display wdth-display text-[clamp(38px,8.2vw,150px)]'
          >
            {t('footer.cta')}
          </h2>
        </div>
        <p
          data-reveal
          style={{ ['--d' as string]: 120 }}
          className='deck col-span-12 text-[clamp(28px,4.2vw,68px)] text-muted lg:col-span-7'
        >
          {t('footer.ctaDeck')}
        </p>
        <div
          data-reveal
          style={{ ['--d' as string]: 200 }}
          className='col-span-12 flex flex-col justify-end gap-5 lg:col-span-5 lg:items-end'
        >
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className='link display wdth-100 self-start text-[clamp(20px,2.2vw,32px)] normal-case tracking-tight lg:self-end'
          >
            {siteConfig.contact.email}
          </a>
          <CopyEmail
            email={siteConfig.contact.email}
            labels={{ copy: t('footer.copy'), copied: t('footer.copied') }}
          />
        </div>
      </section>

      <div className='gutter grid-12 label gap-y-10 border-t border-line py-10'>
        <nav
          aria-label={t('footer.navigate')}
          className='col-span-6 md:col-span-3'
        >
          <p className='mb-4 text-muted'>{t('footer.navigate')}</p>
          <ul className='space-y-2'>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  label={item.label}
                  className='link'
                >
                  {item.index} {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className='col-span-6 md:col-span-3'>
          <p className='mb-4 text-muted'>{t('footer.elsewhere')}</p>
          <ul className='space-y-2'>
            {external.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-1.5'
                >
                  <span className='link'>{link.label}</span>
                  <ArrowUpRight className='transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className='col-span-12 md:col-span-4'>
          <p className='mb-4 text-muted'>{t('footer.colophon')}</p>
          <p className='max-w-[38ch] normal-case leading-relaxed tracking-normal text-fg/80'>
            {t('footer.colophonText')}
          </p>
          <Barcode
            value={`SK-${year}-${lng}`}
            className='mt-5 text-fg/60'
          />
        </div>
        <div className='col-span-12 flex flex-col gap-2 md:col-span-2 md:items-end'>
          <ReplayIntro label={t('intro.replay')} />
          <BackToTop label={t('footer.top')} />
        </div>
      </div>

      <div className='gutter label flex flex-wrap items-center justify-between gap-3 border-t border-line py-4 text-muted'>
        <span>
          © {year} {siteConfig.name}
        </span>
        <span className='hidden items-center gap-2 md:flex'>
          <span className='blink inline-block h-[6px] w-[6px] bg-volt' />
          {t('footer.nominal')}
        </span>
        <span className='hidden lg:inline'>{t('grid')}</span>
      </div>

      {/* Drawn from a pseudo-element: it's a texture, not text. */}
      <div
        aria-hidden='true'
        data-wordmark='Karakaya'
        className='display wdth-125 pointer-events-none -mb-[0.24em] select-none whitespace-nowrap text-center text-[17.4vw] leading-[0.8] text-fg/[0.06] before:content-[attr(data-wordmark)]'
      />
    </footer>
  )
}
