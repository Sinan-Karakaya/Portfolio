import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import ProjectForm from '@/components/admin/ProjectForm'

export const dynamic = 'force-dynamic'

export default async function EditProject({ params: { lng, id } }: { params: { lng: string; id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: parseInt(id) }, include: { description: true } })
  if (!project) notFound()

  return (
    <div>
      <h1 className='display wdth-125 mb-10 text-[clamp(40px,6vw,96px)]'>{project.title}</h1>
      <ProjectForm
        project={project}
        lng={lng}
      />
    </div>
  )
}
