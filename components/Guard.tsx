'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Spinner } from '@nextui-org/react'

export default function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { status: sessionStatus } = useSession()
  const authorized = sessionStatus === 'authenticated'
  const unauthorized = sessionStatus === 'unauthenticated'
  const loading = sessionStatus === 'loading'

  useEffect(() => {
    if (loading) return

    if (unauthorized && pathname.includes('/admin')) {
      router.push('/auth')
    }
  }, [loading, unauthorized, sessionStatus, router])

  if (loading) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <Spinner
          size='lg'
          color='primary'
        />
      </div>
    )
  }

  return authorized || !pathname.includes('/admin') ? <>{children}</> : <></>
}
