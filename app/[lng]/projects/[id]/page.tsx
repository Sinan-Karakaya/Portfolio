import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { useTranslation } from '@/app/i18n'
import { getProjects, projectNumber } from '@/app/lib/projects'
import { localePath } from '@/config/site'
import { ArrowLeft, ArrowRight, ArrowUpRight, GithubIcon } from '@/components/icons'
import { Link } from '@/components/motion/Transition'
import Decode from '@/components/motion/Decode'

export const revalidate = 60

async function load(lng: string, id: string) {
  const projects = await getProjects(lng)
  const index = projects?.findIndex((p) => String(p.id) === id) ?? -1
  return { projects: projects ?? [], index, project: index >= 0 ? projects![index] : null }
}

export async function generateMetadata({
  params: { lng, id },
}: {
  params: { lng: string; id: string }
}): Promise<Metadata> {
  const { project } = await load(lng, id)
  if (!project) return {}
  return {
    title: project.title,
    description: project.summary.slice(0, 160),
    openGraph: { images: project.coverImage ? [project.coverImage] : undefined },
  }
}

export default async function Project({ params: { lng, id } }: { params: { lng: string; id: string } }) {
  const { t } = await useTranslation(lng, 'projects')
  const { projects, index, project } = await load(lng, id)
  if (!project) notFound()

  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null
  const number = projectNumber(index)
  // Each paragraph is followed by the next image; any images left over close the page as a gallery.
  const gallery = project.images.slice(project.paragraphs.length)

  return (
    <article>
      <header className='gutter pt-[5vh]'>
        <Link
          href={localePath(lng, '/projects')}
          label={t('title')}
          className='label group inline-flex items-center gap-2 text-muted transition-colors hover:text-fg'
        >
          <ArrowLeft className='transition-transform duration-300 ease-out group-hover:-translate-x-1' />
          {t('back')}
        </Link>

        <div className='label mt-10 flex items-center justify-between border-t border-line pt-4 text-muted'>
          <Decode text={`${t('index')} ${number} / ${projectNumber(projects.length - 1)}`} />
          <span className='hidden sm:inline'>SK—P{String(project.id).padStart(3, '0')}</span>
        </div>
        <h1
          data-reveal='mask'
          className='display wdth-75 text-balance mt-6 text-[clamp(44px,12.5vw,220px)] leading-[0.84]'
        >
          {project.title}
        </h1>

        <dl
          data-reveal
          style={{ ['--d' as string]: 140 }}
          className='grid-12 mt-10 gap-y-6 border-t border-line pt-5'
        >
          <div className='col-span-12 md:col-span-7'>
            <dt className='label mb-3 text-muted'>{t('stack')}</dt>
            <dd className='flex flex-wrap gap-1.5'>
              {project.languages.map((l) => (
                <span
                  key={l}
                  className='chip'
                >
                  {l}
                </span>
              ))}
            </dd>
          </div>
          {project.github && (
            <div className='col-span-12 md:col-span-5 md:text-right'>
              <dt className='label mb-3 text-muted'>{t('source')}</dt>
              <dd>
                <a
                  href={project.github}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn w-full md:w-auto'
                >
                  <span className='flex items-center gap-3'>
                    <GithubIcon size={16} />
                    {t('viewSource')}
                  </span>
                  <ArrowUpRight className='btn-icon btn-icon-ne' />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </header>

      {project.coverImage && (
        <figure
          data-reveal='wipe'
          style={{ ['--d' as string]: 220 }}
          className='gutter mt-[8vh]'
        >
          <div className='duotone duotone-develop brackets aspect-[16/9] w-full'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt={project.title}
              decoding='async'
            />
          </div>
          <figcaption className='label mt-3 flex justify-between text-muted'>
            <span>
              {t('figure')} 01 — {project.title}
            </span>
            <span>{number}</span>
          </figcaption>
        </figure>
      )}

      <div className='gutter grid-12 mt-[10vh]'>
        <div className='col-span-12 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4'>
          {project.paragraphs.map((paragraph, i) => (
            <div key={i}>
              <p
                data-reveal
                className={
                  i === 0
                    ? 'deck text-pretty mb-10 text-[clamp(26px,2.6vw,42px)] leading-[1.12]'
                    : 'mb-6 text-pretty text-[clamp(17px,1.25vw,19px)] leading-[1.7] text-fg/85'
                }
              >
                {paragraph}
              </p>
              {project.images[i] && (
                <figure
                  data-reveal
                  className='my-14 lg:-mx-[12%]'
                >
                  <div className='duotone duotone-develop aspect-[16/10]'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.images[i]}
                      alt={`${project.title} — ${t('figure')} ${String(i + 2).padStart(2, '0')}`}
                      loading='lazy'
                      decoding='async'
                    />
                  </div>
                  <figcaption className='label mt-3 text-muted'>
                    {t('figure')} {String(i + 2).padStart(2, '0')}
                  </figcaption>
                </figure>
              )}
            </div>
          ))}
        </div>
      </div>

      {gallery.length > 0 && (
        <div className='gutter mt-10 grid gap-[var(--col-gap)] md:grid-cols-2'>
          {gallery.map((src, i) => (
            <figure
              key={src}
              data-reveal
              style={{ ['--d' as string]: i * 80 }}
            >
              <div className='duotone duotone-develop aspect-[16/10]'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} — ${t('figure')} ${String(project.paragraphs.length + i + 2).padStart(
                    2,
                    '0'
                  )}`}
                  loading='lazy'
                  decoding='async'
                />
              </div>
            </figure>
          ))}
        </div>
      )}

      {next && (
        <nav
          aria-label={t('next')}
          className='mt-[16vh] border-t border-line'
        >
          <Link
            href={localePath(lng, `/projects/${next.id}`)}
            label={next.title}
            className='project-row group gutter flex flex-col gap-4 py-[7vh]'
          >
            <span className='label flex items-center justify-between text-muted transition-colors group-hover:text-ink/60'>
              <span>{t('next')}</span>
              <span>{projectNumber((index + 1) % projects.length)}</span>
            </span>
            <span className='flex items-end justify-between gap-6'>
              <span className='display wdth-75 text-[clamp(48px,9vw,160px)] leading-[0.84] transition-transform duration-500 ease-out group-hover:translate-x-3'>
                {next.title}
              </span>
              <ArrowRight
                size={44}
                className='mb-2 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2'
              />
            </span>
          </Link>
        </nav>
      )}
    </article>
  )
}
