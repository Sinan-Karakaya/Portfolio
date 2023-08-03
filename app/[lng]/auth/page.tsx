'use client'

import { Button } from '@nextui-org/button'
import { signIn } from 'next-auth/react'

export default function Auth({
  params: { lng }
}: {
  params: { lng: string }
}) {
  return <Button variant='shadow' color='primary' onPress={() => signIn('credentials', {
    callbackUrl: `/${lng}/admin/projects`
  })}>Login</Button>
}
