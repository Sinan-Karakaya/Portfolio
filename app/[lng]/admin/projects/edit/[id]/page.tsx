import { prisma } from '@/app/lib/prisma'
import EditForm from '@/components/admin/EditForm'
import { useRouter } from 'next/navigation'

export default async function EditProject({ params: { lng, id } }: { params: { lng: string; id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: parseInt(id) }, include: { description: true } })

  return (
    <div className=''>
      {project && (
        <EditForm
          project={project}
          lng={lng}
        />
      )}
    </div>
  )
}
