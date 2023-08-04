import { Card, CardFooter } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Project } from '@prisma/client'
import { title } from './primitives'
import { Link } from '@nextui-org/link'

export default function ProjectCard({ project, lng, isEdit = false }: { project: any, lng: string, isEdit: boolean }) {
  return (
    <Link href={isEdit ? `/admin/projects/edit/${project.id}` : `/projects/${project.id}`}>
      <Card
        isFooterBlurred
        radius='lg'
        className='border-none'
      >
        <Image
          src={project.coverImage}
          alt={project.title}
          height={400}
          width={400}
          className='object-cover'
          isZoomed
        />
        <CardFooter className='before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
          <div className='flex flex-col gap-y-1'>
            <h1 className={`${title({ size: 'xs' })} text-white`}>{project.title}</h1>
            <p className='line-clamp-2 md:line-clamp-3 text-white'>{project.description.text[lng]}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
