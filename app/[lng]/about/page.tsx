import { Metadata } from 'next'
import { getTranslation, useTranslation } from '@/app/i18n'
import { alternates, localePath, siteConfig } from '@/config/site'
import { ArrowDown, ArrowRight, ArrowUpRight } from '@/components/icons'
import { Link } from '@/components/motion/Transition'
import Decode from '@/components/motion/Decode'
import Portrait from '@/components/Portrait'
import SectionHead from '@/components/SectionHead'
import Timeline, { Entry } from '@/components/Timeline'

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await getTranslation(lng, 'about')
  return { title: t('title'), description: t('lead'), alternates: alternates(lng, '/about') }
}

export default async function About({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'about')
  const { t: tc } = await useTranslation(lng, 'common')
  const { t: th } = await useTranslation(lng, 'home')
  const { t: tt } = await useTranslation(lng, 'timeline')
  const body = t('body', { returnObjects: true }) as string[]
  const dossier = [
    [t('dossier.name'), siteConfig.name],
    [t('dossier.role'), tc('role')],
    [t('dossier.base'), t('dossier.baseValue')],
    [t('dossier.education'), t('dossier.educationValue')],
    [t('dossier.exchange'), t('dossier.exchangeValue')],
    [t('dossier.languages'), t('dossier.languagesValue')],
    [t('dossier.interests'), t('dossier.interestsValue')],
  ]

  return (
    <>
      <header className='gutter pt-[7vh]'>
        <Decode
          text={`§ 02 — ${tc('nav.about')}`}
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

      <section className='gutter grid-12 mt-[10vh] gap-y-14'>
        <div className='col-span-12 md:col-span-6 lg:col-span-4'>
          <div className='lg:sticky lg:top-[calc(var(--hud-h)+32px)]'>
            <div
              data-reveal='fade'
              className='mx-auto max-w-[420px] md:mx-0'
            >
              <Portrait
                src='/assets/images/me.webp'
                signal='/assets/images/me-signal.jpg'
                signalLight='/assets/images/me-signal-light.jpg'
                alt={`${siteConfig.name} — portrait`}
                labels={{
                  figure: `Fig. 02 — ${t('dossier.title')}`,
                  dither: th('modes.dither'),
                  ascii: th('modes.ascii'),
                  raw: th('modes.raw'),
                }}
              />
            </div>
            <dl
              data-reveal
              style={{ ['--d' as string]: 120 }}
              className='mt-10 border-t border-line'
            >
              {dossier.map(([k, v]) => (
                <div
                  key={k}
                  className='grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-3'
                >
                  <dt className='label pt-[3px] text-muted'>{k}</dt>
                  <dd className='text-[15px] leading-snug'>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className='col-span-12 lg:col-span-7 lg:col-start-6'>
          <p
            data-reveal
            className='deck text-pretty text-[clamp(30px,3.1vw,50px)] leading-[1.08]'
          >
            {t('lead')}
          </p>
          <div className='measure mt-12 space-y-6 text-[clamp(17px,1.25vw,19px)] leading-[1.7] text-fg/85'>
            {body.map((paragraph, i) => (
              <p
                key={i}
                data-reveal
                className='text-pretty'
              >
                <span className='label mr-3 align-[2px] text-muted'>{String(i + 1).padStart(2, '0')}</span>
                {paragraph}
              </p>
            ))}
          </div>
          <div
            data-reveal
            className='mt-12 flex flex-wrap gap-2.5'
          >
            <a
              href={`/assets/SinanKarakaya_CV_${lng}.pdf`}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-primary min-w-[13rem]'
            >
              {t('cv')}
              <ArrowDown className='btn-icon' />
            </a>
            <Link
              href={localePath(lng, '/projects')}
              label={tc('nav.projects')}
              className='btn min-w-[13rem]'
            >
              {t('projects')}
              <ArrowRight className='btn-icon' />
            </Link>
            <Link
              href={localePath(lng, '/contact')}
              label={tc('nav.contact')}
              className='btn min-w-[13rem]'
            >
              {t('contact')}
              <ArrowUpRight className='btn-icon btn-icon-ne' />
            </Link>
          </div>
        </div>
      </section>

      <section className='pt-[16vh]'>
        <SectionHead
          index='02.1'
          label={th('log.title')}
          title={t('timeline')}
          deck={th('log.deck')}
        />
        <Timeline entries={tt('entries', { returnObjects: true }) as Entry[]} />
      </section>
    </>
  )
}
