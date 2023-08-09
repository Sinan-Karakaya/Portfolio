import { useTranslation } from '@/app/i18n'
import { prisma } from '@/app/lib/prisma'
import ProjectCard from '@/components/ProjectCard'

export default async function Projects({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'projects')
  const projects = await prisma.project.findMany({
    orderBy: {
      weight: 'desc'
    },
    include: {
      description: true,
    }
  })

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-2'>
      {projects.map((project, index) => (
        <ProjectCard project={project} lng={lng} key={index} />
      ))}
    </div>
  )
}