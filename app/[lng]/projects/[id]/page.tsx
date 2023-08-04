import { prisma } from '@/app/lib/prisma'
import { GithubIcon } from '@/components/icons'
import { title } from '@/components/primitives'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Link } from '@nextui-org/link'
import { Spacer } from '@nextui-org/spacer'
import { Spinner } from '@nextui-org/spinner'

export default async function Project({ params: { lng, id } }: { params: { lng: string; id: string } }) {
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      description: true,
    },
  })

  if (!project || !project.description || !project.description.text) {
    return <Spinner />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex w-full justify-between items-center mb-1'>
            <h1 className={`${title()}`}>{project.title}</h1>
            <div className='flex flex-col items-center'>
              <Link href={project.github} color='foreground' isExternal>
                <GithubIcon size={50} />
              </Link>
            </div>
          </div>
        </CardHeader>
        <Image
          src={project.coverImage}
          isBlurred
          alt={project.title}
        />
        <CardBody>
          {project?.description.text[lng as keyof typeof project.description.text]
            .split('\n\n')
            .map((paragraph: string, index: number) => (
              <>
                <p className=''>{paragraph}</p>
                <Spacer y={2} />
                {project.images[index + 1] && (
                  <Image
                    src={project.images[index + 1]}
                    isBlurred
                    alt={project.title}
                  />
                )}
              </>
            ))}
        </CardBody>
      </Card>
    </div>
  )
}
