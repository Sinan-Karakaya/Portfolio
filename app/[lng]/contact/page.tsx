import { Metadata } from 'next'
import { getTranslation, useTranslation } from '@/app/i18n'
import { alternates, siteConfig } from '@/config/site'
import { ArrowDown, ArrowUpRight } from '@/components/icons'
import ContactForm, { ContactLabels } from '@/components/ContactForm'
import { Clock } from '@/components/chrome/Controls'
import { CopyEmail } from '@/components/chrome/FooterActions'
import Decode from '@/components/motion/Decode'

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await getTranslation(lng, 'contact')
  return { title: t('title'), description: t('deck'), alternates: alternates(lng, '/contact') }
}

export default async function ContactPage({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'contact')
  const { t: tc } = await useTranslation(lng, 'common')
  const labels = Object.fromEntries(
    [
      'yourName',
      'yourEmail',
      'yourPhone',
      'yourMessage',
      'optional',
      'send',
      'sending',
      'sentTitle',
      'sentMessage',
      'another',
      'errorMessage',
    ].map((k) => [k, t(k)])
  ) as ContactLabels

  const row = (label: string, children: React.ReactNode) => (
    <div className='grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-line py-4'>
      <dt className='label text-muted'>{label}</dt>
      <dd className='min-w-0'>{children}</dd>
    </div>
  )

  return (
    <>
      <header className='gutter pt-[7vh]'>
        <Decode
          text={`§ 04 — ${tc('nav.contact')}`}
          className='label block text-muted'
        />
        <h1
          data-reveal='mask'
          className='display wdth-display mt-6 text-[clamp(52px,13.5vw,240px)]'
        >
          {t('title')}
        </h1>
        <p
          data-reveal
          style={{ ['--d' as string]: 160 }}
          className='deck text-balance mt-6 max-w-[22em] text-[clamp(28px,3.4vw,56px)] text-muted'
        >
          {t('deck')}
        </p>
      </header>

      <section className='gutter grid-12 mt-[10vh] gap-y-16'>
        <div
          data-reveal
          className='col-span-12 lg:col-span-7'
        >
          <ContactForm labels={labels} />
        </div>

        <div
          data-reveal
          style={{ ['--d' as string]: 140 }}
          className='col-span-12 lg:col-span-4 lg:col-start-9'
        >
          <p className='label mb-2 text-muted'>{t('coordinates')}</p>
          <dl className='border-t border-line'>
            {row(
              t('email'),
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className='link break-all text-[17px]'
              >
                {siteConfig.contact.email}
              </a>
            )}
            {row(
              t('phone'),
              <a
                href={siteConfig.contact.phoneHref}
                className='link tabular text-[17px]'
              >
                {siteConfig.contact.phone}
              </a>
            )}
            {row(
              t('social'),
              <span className='flex flex-wrap gap-x-5 gap-y-1 text-[17px]'>
                {[
                  ['LinkedIn', siteConfig.links.linkedin],
                  ['GitHub', siteConfig.links.github],
                ].map(([name, href]) => (
                  <a
                    key={name}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group inline-flex items-center gap-1.5'
                  >
                    <span className='link'>{name}</span>
                    <ArrowUpRight className='transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                  </a>
                ))}
              </span>
            )}
            {row(
              t('location'),
              <span className='flex flex-col gap-1.5 text-[17px]'>
                {siteConfig.location.city}, France
                <Clock
                  timeZone={siteConfig.location.timeZone}
                  code='RNS'
                  label={tc('localTime')}
                />
              </span>
            )}
          </dl>
          <div className='mt-8 flex flex-wrap gap-2.5'>
            <CopyEmail
              email={siteConfig.contact.email}
              labels={{ copy: tc('footer.copy'), copied: tc('footer.copied') }}
            />
            <a
              href={`/assets/SinanKarakaya_CV_${lng}.pdf`}
              target='_blank'
              rel='noopener noreferrer'
              className='btn'
            >
              {tc('footer.resume')}
              <ArrowDown className='btn-icon' />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
