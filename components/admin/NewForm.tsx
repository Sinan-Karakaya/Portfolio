'use client'

import { useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardHeader, Divider, Image, Input, Link, Textarea } from '@nextui-org/react'
import { Project } from '@prisma/client'
import { useRouter } from 'next/navigation'

export default function NewForm({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'newForm')
  const router = useRouter()

  const [title, setTitle] = useState<string | undefined>()
  const [description, setDescription] = useState<string | undefined>()
  const [languages, setLanguages] = useState<string | undefined>()
  const [github, setGithub] = useState<string | undefined>()
  const [images, setImages] = useState<FileList | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submitFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files)
    }
  }

  const submitProject = async () => {
    const imagesURLs: string[] = []
    setSubmitting(true)

    // const imagesArray = Array.from(images || [])
    // imagesArray.forEach(async (image) => {
    //   const imagesForm = new FormData()
    //   imagesForm.append('file', image as Blob)
    //   imagesForm.append('upload_preset', 'portfolio')

    //   const res = await fetch('cloudinary', {     // TODO: CHange url to cloudinary upload url
    //     method: 'POST',
    //     body: imagesForm,
    //   })
    //   if (res.ok) {
    //     const data = await res.json()
    //     imagesURLs.push(data.secure_url)
    //   }
    // })

    const status = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        description: description?.split('\n\n'),
        languages: languages?.split('/'),
        github,
        coverImage: imagesURLs[0] ?? 'coucou',
        images: imagesURLs.slice(1) ?? [],
      }),
    })
    setSubmitting(false)
    if (status.ok) {
      router.push(`/${lng}/admin/projects`)
    } else {
      setError('Something went wrong when uploading the project')
    }
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='max-w-5xl'>
        <Card>
          <CardBody>
            <div className='grid grid-cols-2 gap-4 w-full justify-between'>
                <Input isRequired label='Project title' value={title} onValueChange={setTitle} />
                <Input isRequired label='Languages' value={languages} onValueChange={setLanguages} />
              <Textarea
                label='Project description'
                minRows={10}
                className='col-span-2'
                value={description}
                onValueChange={setDescription}
                isRequired
              />
              <div className='col-span-2'>
                <label className='text-foreground-500 text-xs -mb-3'>
                  All images of the project will be overwritten
                </label>
                <input
                  type='file'
                  required
                  multiple
                  onChange={submitFile}
                  className='w-full text-sm border border-none rounded-lg cursor-pointer bg-foreground-100 dark:text-foreground-500  hover:bg-foreground-200'
                />
              </div>
              <Input isRequired label='Github' className='col-span-2' value={github} onValueChange={setGithub} />
              <Button
                as={Link}
                href={`/${lng}/admin/projects`}
                variant='shadow'
              >
                Back
              </Button>
              <Button
                variant='shadow'
                color='primary'
                isLoading={submitting}
                onPress={submitProject}
              >
                Submit
              </Button>
              {error && <p className='col-span-2 text-danger-400'>{error}</p>}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
