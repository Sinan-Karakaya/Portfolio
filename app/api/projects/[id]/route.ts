import { prisma } from '@/app/lib/prisma'
import { LANGUAGES, Project } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(params.id),
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { description, id, ...json } = await req.json()

    const project = await prisma.project.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        description: {
          update: {
            text: description,
          }
        },
        ...json,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.delete({
      where: {
        id: parseInt(params.id),
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
