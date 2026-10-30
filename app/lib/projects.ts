import { cache } from 'react'
import type { Project, TextTranslation } from '@prisma/client'
import { prisma } from './prisma'

export type ProjectRecord = Project & { description: TextTranslation }

export type ProjectView = {
  id: number
  title: string
  languages: string[]
  coverImage: string
  images: string[]
  github: string
  paragraphs: string[]
  summary: string
}

// Picks the visitor's language, falling back to English, and splits the body into paragraphs.
export function localize(project: ProjectRecord, lng: string): ProjectView {
  const text = (project.description?.text ?? {}) as Record<string, string | undefined>
  const body = text[lng] || text.en || Object.values(text).find(Boolean) || ''
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  return {
    id: project.id,
    title: project.title,
    languages: project.languages.filter(Boolean),
    coverImage: project.coverImage,
    images: project.images.filter((src) => src && src !== project.coverImage),
    github: project.github,
    paragraphs,
    summary: paragraphs[0] ?? '',
  }
}

// Returns null when the database can't be reached, so pages can say so instead of crashing.
// Cached per request: metadata and page share one query.
export const getProjects = cache(async (lng: string): Promise<ProjectView[] | null> => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { weight: 'desc' }, include: { description: true } })
    return projects.map((p) => localize(p, lng))
  } catch (error) {
    console.error('[projects] could not load projects', error)
    return null
  }
})

export const projectNumber = (index: number) => String(index + 1).padStart(3, '0')
