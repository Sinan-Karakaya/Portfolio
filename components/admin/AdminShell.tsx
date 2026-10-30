'use client'

import { SessionProvider } from 'next-auth/react'
import Guard from '@/components/Guard'

// Session state is only needed behind /admin, so the public pages never wait on it.
export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Guard>{children}</Guard>
    </SessionProvider>
  )
}
