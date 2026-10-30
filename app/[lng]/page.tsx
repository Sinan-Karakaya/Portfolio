import { useTranslation } from '@/app/i18n'
import { getProjects, projectNumber } from '@/app/lib/projects'
import { localePath, siteConfig } from '@/config/site'
import { ArrowRight, ArrowUpRight } from '@/components/icons'
import { Link } from '@/components/motion/Transition'
import Decode from '@/components/motion/Decode'
import Loadout, { Module } from '@/components/Loadout'
import Marquee from '@/components/Marquee'
import Portrait from '@/components/Portrait'
import ProjectList from '@/components/ProjectList'
import SectionHead from '@/components/SectionHead'
import StretchName from '@/components/StretchName'
import Timeline, { Entry } from '@/components/Timeline'
import Rich from '@/components/ui/Rich'

export const revalidate = 60

export default async function Home({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'home')
  const { t: tc } = await useTranslation(lng, 'common')
  const { t: tp } = await useTranslation(lng, 'projects')
  const { t: tt } = await useTranslation(lng, 'timeline')
  const projects = await getProjects(lng)
  const now = new Date()
  const rev = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`
  const featured = (projects ?? []).slice(0, 4).map((p, i) => ({
    id: p.id,
    number: projectNumber(i),
    title: p.title,
    languages: p.languages,
    coverImage: p.coverImage,
    summary: p.summary,
    href: localePath(lng, `/projects/${p.id}`),
  }))

  return (
    <>
      <section className='gutter relative flex min-h-[calc(100svh-var(--hud-h))] flex-col pb-[6vh] pt-4'>
        <div className='grid-12 label border-b border-line pb-4 text-muted'>
          <span
            data-reveal='fade'
            className='col-span-6 md:col-span-3'
          >
            SK—01 / {t('kicker')}
          </span>
          <span
            data-reveal='fade'
            style={{ ['--d' as string]: 60 }}
            className='hidden md:col-span-3 md:block'
          >
            Rev. {rev}
          </span>
          <span
            data-reveal='fade'
            style={{ ['--d' as string]: 120 }}
            className='hidden md:col-span-3 md:block'
          >
            {siteConfig.location.coordinates}
          </span>
          <span
            data-reveal='fade'
            style={{ ['--d' as string]: 180 }}
            className='col-span-6 flex items-center justify-end gap-2 text-fg md:col-span-3'
          >
            <span className='blink inline-block h-[6px] w-[6px] bg-volt' />
            {siteConfig.location.city}, {siteConfig.location.country}
          </span>
        </div>

        <div className='grid-12 flex-1 gap-y-12 pt-[4.5vh]'>
          <div className='col-span-12 flex flex-col lg:col-span-8'>
            <h1 aria-label={siteConfig.name}>
              <StretchName lines={siteConfig.name.split(' ')} />
            </h1>
            <p
              data-reveal
              style={{ ['--d' as string]: 260 }}
              className='deck text-balance mt-[4vh] max-w-[17em] text-[clamp(30px,3.3vw,54px)]'
            >
              {t('deck')}
            </p>
            <div className='mt-auto flex flex-col gap-8 pt-[5vh] xl:flex-row xl:items-end xl:justify-between'>
              <p
                data-reveal
                style={{ ['--d' as string]: 360 }}
                className='max-w-[44ch] text-pretty text-[16px] leading-relaxed text-muted'
              >
                <Rich text={t('lead')} />
              </p>
              <div
                data-reveal
                style={{ ['--d' as string]: 440 }}
                className='flex flex-wrap gap-2.5'
              >
                <Link
                  href={localePath(lng, '/projects')}
                  label={tc('nav.projects')}
                  className='btn btn-primary min-w-[13rem]'
                >
                  {t('ctaWork')}
                  <ArrowRight className='btn-icon' />
                </Link>
                <Link
                  href={localePath(lng, '/contact')}
                  label={tc('nav.contact')}
                  className='btn min-w-[13rem]'
                >
                  {t('ctaContact')}
                  <ArrowUpRight className='btn-icon btn-icon-ne' />
                </Link>
              </div>
            </div>
          </div>
          <div
            data-reveal='fade'
            style={{ ['--d' as string]: 200 }}
            className='col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9'
          >
            <Portrait
              src='/assets/images/me.webp'
              signal='/assets/images/me-signal.jpg'
              signalLight='/assets/images/me-signal-light.jpg'
              alt={`${siteConfig.name} — portrait`}
              labels={{
                figure: `Fig. 01 — ${t('portrait')}`,
                dither: t('modes.dither'),
                ascii: t('modes.ascii'),
                raw: t('modes.raw'),
              }}
            />
          </div>
        </div>
      </section>

      <Marquee
        items={siteConfig.stack}
        label={siteConfig.stack.join(', ')}
      />

      <section className='pt-[8vh]'>
        <SectionHead
          index='01'
          label={tc('nav.projects')}
          title={t('work.title')}
          deck={t('work.deck')}
          aside={
            projects && projects.length > 0 ? (
              <Link
                href={localePath(lng, '/projects')}
                label={tc('nav.projects')}
                className='group flex items-center gap-2 text-fg'
              >
                <span className='link'>
                  {t('work.all')} ({String(projects.length).padStart(2, '0')})
                </span>
                <ArrowRight className='transition-transform duration-300 ease-out group-hover:translate-x-1' />
              </Link>
            ) : null
          }
        />
        {featured.length > 0 ? (
          <ProjectList
            projects={featured}
            labels={{ all: tp('all'), filter: tp('filter'), figure: tp('figure') }}
          />
        ) : (
          <p className='gutter label mt-10 border-y border-line py-10 text-muted'>
            {projects ? tp('empty') : tp('offline')}
          </p>
        )}
      </section>

      <section className='pt-[16vh]'>
        <SectionHead
          index='02'
          label={t('loadout.title')}
          title={t('loadout.title')}
          deck={t('loadout.deck')}
        />
        <Loadout modules={t('loadout.modules', { returnObjects: true }) as Module[]} />
      </section>

      <section className='pt-[16vh]'>
        <SectionHead
          index='03'
          label={t('log.title')}
          title={t('log.title')}
          deck={t('log.deck')}
          aside={
            <Link
              href={localePath(lng, '/about')}
              label={tc('nav.about')}
              className='group flex items-center gap-2 text-fg'
            >
              <Decode
                text={t('log.more')}
                className='link'
              />
              <ArrowRight className='transition-transform duration-300 ease-out group-hover:translate-x-1' />
            </Link>
          }
        />
        <Timeline
          entries={tt('entries', { returnObjects: true }) as Entry[]}
          limit={4}
        />
      </section>
    </>
  )
}
