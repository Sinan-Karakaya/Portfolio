import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      cloudName: process.env.CLOUD_NAME,
      cloudPreset: process.env.CLOUD_PRESET,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
