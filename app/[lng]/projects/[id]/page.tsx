import { prisma } from '@/app/lib/prisma'
import { GithubIcon } from '@/components/icons'
import { title } from '@/components/primitives'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Chip } from '@nextui-org/chip'
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
            <div className='flex items-center gap-x-2'>
              <div className='lg:flex hidden gap-x-2'>
                {project.languages.map((language: string, index: number) => (
                  <Chip
                    variant='shadow'
                    color='primary'
                    key={index}
                  >
                    {language.length === 1 ? ` ${language} ` : language}
                  </Chip>
                ))}
              </div>
              <Link
                href={project.github}
                color='foreground'
                isExternal
              >
                <GithubIcon size={50} />
              </Link>
            </div>
          </div>
        </CardHeader>
        <div className='w-full flex-col justify-center'>
          <Image
            src={project.coverImage}
            isBlurred
            alt={project.title}
            className='object-cover'
          />
        </div>
        <CardBody>
          {project?.description.text[lng as keyof typeof project.description.text]
            // TODO: Fix this
            // @ts-ignore
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
