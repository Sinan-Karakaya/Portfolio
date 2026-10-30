'use client'

import { ArrowLeft } from '@/components/icons'
import { Link } from '@/components/motion/Transition'
import SignalLost, { useCommonDictionary } from '@/components/SignalLost'

export default function NotFound() {
  const { lng, dict } = useCommonDictionary()

  return (
    <SignalLost
      code='404'
      title={dict.notFound.title}
      deck={dict.notFound.deck}
    >
      <Link
        href={`/${lng}`}
        label={dict.nav.home}
        className='btn btn-primary min-w-[15rem]'
      >
        <ArrowLeft className='btn-icon' />
        {dict.notFound.back}
      </Link>
    </SignalLost>
  )
}
