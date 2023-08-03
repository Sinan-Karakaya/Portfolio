import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const projects = await prisma.project.findMany()

    return NextResponse.json(projects)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()

    const project = await prisma.project.create({
      data: {
        title: json.title,
        description: json.description,
        coverImage: json.coverImage,
        github: json.github,
        languages: json.languages,
        images: json.images,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
