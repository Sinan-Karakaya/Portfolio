import { prisma } from '@/app/lib/prisma'
import ProjectCard from '@/components/ProjectCard'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'

export default async function Admin({ params: { lng } }: { params: { lng: string } }) {
  const projects = await prisma.project.findMany({
    orderBy: {
      weight: 'desc',
    },
    include: { description: true },
  })

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex justify-end'>
        <Button
          color='primary'
          variant='shadow'
          as={Link}
          href='/admin/projects/new'
        >
          New
        </Button>
      </div>
      <section className='grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto md:max-h-[64rem]'>
        {projects.map((project, index) => (
          <ProjectCard
            project={project}
            lng={lng}
            isEdit
            key={index}
          />
        ))}
      </section>
    </div>
  )
}
