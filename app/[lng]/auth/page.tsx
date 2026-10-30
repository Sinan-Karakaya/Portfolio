'use client'

import { signIn } from 'next-auth/react'
import { ArrowRight } from '@/components/icons'

export default function Auth({ params: { lng } }: { params: { lng: string } }) {
  return (
    <section className='gutter flex min-h-[70vh] flex-col items-start justify-center gap-8'>
      <p className='label flex items-center gap-2 text-muted'>
        <span className='inline-block h-[7px] w-[7px] bg-signal' />
        SK/OS — Restricted
      </p>
      <h1 className='display wdth-125 text-[clamp(48px,9vw,150px)]'>Login</h1>
      <button
        type='button'
        className='btn btn-primary min-w-[14rem]'
        onClick={() =>
          signIn('credentials', {
            callbackUrl: `/${lng}/admin/projects`,
          })
        }
      >
        Authenticate
        <ArrowRight className='btn-icon' />
      </button>
    </section>
  )
}
