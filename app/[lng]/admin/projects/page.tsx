import { prisma } from '@/app/lib/prisma'
import { localize, projectNumber } from '@/app/lib/projects'
import { ArrowRight } from '@/components/icons'

export const dynamic = 'force-dynamic'

export default async function Admin({ params: { lng } }: { params: { lng: string } }) {
  const projects = await prisma.project.findMany({
    orderBy: {
      weight: 'desc',
    },
    include: { description: true },
  })

  return (
    <div className='flex flex-col gap-y-8'>
      <div className='flex items-end justify-between gap-4'>
        <h1 className='display wdth-125 text-[clamp(40px,6vw,96px)]'>Projects</h1>
        <a
          href={`/${lng}/admin/projects/new`}
          className='btn btn-primary'
        >
          New
          <ArrowRight className='btn-icon' />
        </a>
      </div>
      <ol className='border-b border-line'>
        {projects.map((project, index) => {
          const view = localize(project, lng)
          return (
            <li
              key={project.id}
              className='border-t border-line'
            >
              <a
                href={`/${lng}/admin/projects/edit/${project.id}`}
                className='project-row group grid grid-cols-[3rem_1fr_auto] items-center gap-4 px-2 py-4'
              >
                <span className='label tabular text-muted group-hover:text-ink/60'>{projectNumber(index)}</span>
                <span>
                  <span className='display wdth-75 block text-[clamp(26px,3vw,44px)]'>{project.title}</span>
                  <span className='label text-muted group-hover:text-ink/60'>
                    {view.languages.join(' · ')} — weight {project.weight}
                  </span>
                </span>
                <ArrowRight size={20} />
              </a>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
