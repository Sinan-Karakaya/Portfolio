'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from '@/components/icons'

type Translation = {
  en: string
  fr: string
}

export type EditableProject = {
  id: number
  title: string
  description: { text: unknown }
  languages: string[]
  github: string
  weight: number
  coverImage: string
  images: string[]
}

// One form for creating and editing a project.
export default function ProjectForm({ lng, project }: { lng: string; project?: EditableProject }) {
  const router = useRouter()
  const isEdit = Boolean(project)

  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState<Translation>({
    en: '',
    fr: '',
    ...(project?.description.text as Partial<Translation>),
  })
  const [languages, setLanguages] = useState(project?.languages.join('/') ?? '')
  const [github, setGithub] = useState(project?.github ?? '')
  const [weight, setWeight] = useState<number>(project?.weight ?? 0)
  const [images, setImages] = useState<FileList | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

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

  const submitProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const imagesURLs = await uploadImages()
    const body = {
      title,
      description,
      languages: languages
        .split('/')
        .map((l) => l.trim())
        .filter(Boolean),
      github,
      weight,
      // Without new uploads, an edit keeps the current images.
      coverImage: imagesURLs[0] ?? project?.coverImage,
      images: imagesURLs.length ? imagesURLs.slice(1) : project?.images ?? [],
    }

    const status = await fetch(isEdit ? `/api/projects/${project!.id}` : '/api/projects', {
      method: isEdit ? 'PATCH' : 'POST',
      body: JSON.stringify(isEdit ? { id: project!.id, ...body } : body),
    })
    setSubmitting(false)
    if (status.ok) {
      router.push(`/${lng}/admin/projects`)
      router.refresh()
    } else {
      setError('Something went wrong when uploading the project')
    }
  }

  const deleteProject = async () => {
    if (!project || !window.confirm(`Delete “${project.title}”?`)) return
    setDeleting(true)
    const status = await fetch(`/api/projects/${project.id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id: project.id }),
    })
    setDeleting(false)
    if (status.ok) {
      router.push(`/${lng}/admin/projects`)
      router.refresh()
    } else {
      setError('Something went wrong when deleting the project')
    }
  }

  const label = (text: string) => <span className='label mb-1 block text-muted'>{text}</span>

  return (
    <form
      onSubmit={submitProject}
      className='grid gap-x-[var(--col-gap)] gap-y-9 md:grid-cols-2'
    >
      <label>
        {label('Project title')}
        <input
          className='field'
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        {label('Languages — separated by /')}
        <input
          className='field'
          required
          value={languages}
          placeholder='C++/CUDA'
          onChange={(e) => setLanguages(e.target.value)}
        />
      </label>
      {(['en', 'fr'] as const).map((code) => (
        <label key={code}>
          {label(`Description — ${code === 'en' ? 'English' : 'Français'}`)}
          <textarea
            className='field min-h-[16rem] resize-y text-[17px] leading-relaxed'
            required={!isEdit}
            value={description[code]}
            onChange={(e) => setDescription({ ...description, [code]: e.target.value })}
          />
        </label>
      ))}
      <label className='md:col-span-2'>
        {label(
          isEdit
            ? 'Images — uploading replaces all of them (first one is the cover)'
            : 'Images — the first one is the cover'
        )}
        <input
          type='file'
          multiple
          accept='image/*'
          required={!isEdit}
          onChange={(e) => e.target.files && setImages(e.target.files)}
          className='label mt-2 block w-full cursor-pointer border border-dashed border-line-2 p-4 file:mr-4 file:cursor-pointer file:border-0 file:bg-volt file:px-3 file:py-2 file:text-ink'
        />
      </label>
      <label>
        {label('GitHub')}
        <input
          className='field'
          type='url'
          required
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />
      </label>
      <label>
        {label('Weight — higher comes first')}
        <input
          className='field tabular'
          type='number'
          value={weight}
          onChange={(e) => setWeight(parseInt(e.target.value || '0'))}
        />
      </label>

      {error && (
        <p
          role='alert'
          className='text-signal md:col-span-2'
        >
          {error}
        </p>
      )}

      <div className='flex flex-wrap gap-2.5 md:col-span-2'>
        <a
          href={`/${lng}/admin/projects`}
          className='btn'
        >
          <ArrowLeft className='btn-icon' />
          Back
        </a>
        {isEdit && (
          <button
            type='button'
            onClick={deleteProject}
            disabled={deleting}
            className='btn border-signal text-signal'
          >
            {deleting ? 'Deleting…' : 'Delete project'}
          </button>
        )}
        <button
          type='submit'
          disabled={submitting}
          className='btn btn-primary ml-auto min-w-[14rem]'
        >
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
          <ArrowRight className='btn-icon' />
        </button>
      </div>
    </form>
  )
}
