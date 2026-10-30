import { Metadata } from 'next'
import { getTranslation, useTranslation } from '@/app/i18n'
import { getProjects, projectNumber } from '@/app/lib/projects'
import { alternates, localePath } from '@/config/site'
import Decode from '@/components/motion/Decode'
import ProjectList from '@/components/ProjectList'

export const revalidate = 60

export async function generateMetadata({ params: { lng } }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await getTranslation(lng, 'projects')
  return { title: t('title'), description: t('deck'), alternates: alternates(lng, '/projects') }
}

export default async function Projects({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'projects')
  const { t: tc } = await useTranslation(lng, 'common')
  const projects = await getProjects(lng)
  const items = (projects ?? []).map((p, i) => ({
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
      <header className='gutter pt-[7vh]'>
        <Decode
          text={`§ 03 — ${tc('nav.projects')}`}
          className='label block text-muted'
        />
        <h1
          data-reveal='mask'
          className='display wdth-display mt-6 flex items-start gap-[0.12em] text-[clamp(52px,13.5vw,240px)]'
        >
          {t('title')}
          {items.length > 0 && (
            <sup className='font-dot mt-[0.08em] text-[0.22em] font-black tracking-normal text-accent'>
              {String(items.length).padStart(2, '0')}
            </sup>
          )}
        </h1>
        <p
          data-reveal
          style={{ ['--d' as string]: 160 }}
          className='deck text-balance mt-6 max-w-[24em] text-[clamp(28px,3.4vw,56px)] text-muted'
        >
          {t('deck')}
        </p>
      </header>

      {items.length > 0 ? (
        <ProjectList
          projects={items}
          labels={{ all: t('all'), filter: t('filter'), figure: t('figure') }}
          heading='h2'
          filters
        />
      ) : (
        <p className='gutter label mt-16 border-y border-line py-10 text-muted'>
          {projects ? t('empty') : t('offline')}
        </p>
      )}
    </>
  )
}
