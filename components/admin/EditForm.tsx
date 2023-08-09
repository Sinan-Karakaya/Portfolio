'use client'

import { useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardHeader, Divider, Image, Input, Link, Tab, Tabs, Textarea } from '@nextui-org/react'
import { Project } from '@prisma/client'
import { useRouter } from 'next/navigation'

type Translation = {
  en: string
  fr: string
}

export default function EditForm({ project, lng }: { project: any; lng: string }) {
  const { t } = useTranslation(lng, 'editForm')
  const router = useRouter()

  const [title, setTitle] = useState<string | undefined>(project.title)
  const [description, setDescription] = useState<Translation | undefined>(project.description.text)
  const [languages, setLanguages] = useState<string | undefined>(project.languages.concat('/').join('').slice(0, -1))
  const [github, setGithub] = useState<string | undefined>(project.github)
  const [weight, setWeight] = useState<number | undefined>(project.weight)
  const [images, setImages] = useState<FileList | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const tabs = [
    {
      id: 'en',
      title: 'English',
    },
    {
      id: 'fr',
      title: 'Français',
    },
  ]

  const submitFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files)
    }
  }

  const deleteProject = async () => {
    setDeleting(true)
    const status = await fetch(`/api/projects/${project.id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id: project.id }),
    })
    setDeleting(false)
    if (status) {
      router.push(`/${lng}/admin/projects`)
    } else {
      setError('Something went wrong when uploading the images')
    }
  }

  const uploadImages = async (): Promise<string[]> => {
    const imagesURLs: string[] = []
    const cloudSecrets = await fetch('/api/secrets/cloudinary').then((res) => res.json())

    const imagesArray = Array.from(images || [])
    for (const image of imagesArray) {
      const imagesForm = new FormData()
      imagesForm.append('file', image as Blob)
      imagesForm.append('upload_preset', cloudSecrets.cloudPreset)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudSecrets.cloudName}/image/upload`, {
        method: 'POST',
        body: imagesForm,
      })
      if (res.ok) {
        const data = await res.json()
        imagesURLs.push(data.secure_url)
      }
    }

    return imagesURLs
  }

  const submitProject = async () => {
    setSubmitting(true)

    const imagesURLs = await uploadImages()

    const status = await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: project.id,
        title,
        description: description,
        languages: languages?.split('/'),
        github,
        coverImage: imagesURLs[0] ?? project.coverImage,
        images: imagesURLs.slice(1) ?? project.images,
        weight: weight ?? project.weight,
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
      <div className='flex justify-end'>
        <Button
          onPress={deleteProject}
          variant='shadow'
          color='danger'
          isLoading={deleting}
        >
          Delete Project
        </Button>
      </div>
      <div className='max-w-5xl'>
        <Card>
          <CardBody>
            <Tabs
              fullWidth
              items={tabs}
            >
              {(item) => (
                <Tab
                  key={item.id}
                  title={item.title}
                >
                  <div className='grid grid-cols-2 gap-4 w-full justify-between'>
                    <Input
                      label='Project title'
                      value={title}
                      onValueChange={setTitle}
                    />
                    <Input
                      label='Languages'
                      value={languages}
                      onValueChange={setLanguages}
                    />
                    <Textarea
                      label='Project description'
                      minRows={10}
                      className='col-span-2'
                      value={description ? description[item.id as keyof Translation] : ''}
                      onValueChange={(value) => description && setDescription({ ...description, [item.id]: value })}
                    />
                    <div className='col-span-2'>
                      <label className='text-foreground-500 text-xs -mb-3'>
                        All images of the project will be overwritten
                      </label>
                      <input
                        type='file'
                        multiple
                        onChange={submitFile}
                        className='w-full text-sm border border-none rounded-lg cursor-pointer bg-foreground-100 dark:text-foreground-500  hover:bg-foreground-200'
                      />
                    </div>
                    <Input
                      label='Github'
                      className='col-span-2'
                      value={github}
                      onValueChange={setGithub}
                    />
                    <Input
                      label='Weight'
                      className='col-span-2'
                      type='number'
                      value={weight?.toString()}
                      onValueChange={(value) => setWeight(parseInt(value || '0'))}
                    />
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
                </Tab>
              )}
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
