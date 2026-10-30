'use client'

import { useEffect } from 'react'
import { ArrowLeft } from '@/components/icons'
import { Link } from '@/components/motion/Transition'
import SignalLost, { useCommonDictionary } from '@/components/SignalLost'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { lng, dict } = useCommonDictionary()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <SignalLost
      code='500'
      title={dict.error.title}
      deck={dict.error.deck}
    >
      <button
        type='button'
        className='btn btn-primary min-w-[13rem]'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        {dict.error.retry}
      </button>
      <Link
        href={`/${lng}`}
        label={dict.nav.home}
        className='btn min-w-[13rem]'
      >
        <ArrowLeft className='btn-icon' />
        {dict.notFound.back}
      </Link>
    </SignalLost>
  )
}
