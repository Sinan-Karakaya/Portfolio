'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

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
      router.push(`/${pathname.split('/')[1]}/auth`)
    }
  }, [loading, unauthorized, sessionStatus, router, pathname])

  if (loading) {
    return (
      <div className='label flex min-h-[50vh] items-center justify-center gap-3 text-muted'>
        <span className='blink inline-block h-[7px] w-[7px] bg-volt' />
        Authenticating…
      </div>
    )
  }

  return authorized || !pathname.includes('/admin') ? <>{children}</> : <></>
}
