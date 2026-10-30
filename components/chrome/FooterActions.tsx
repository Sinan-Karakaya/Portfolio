'use client'

import { useState } from 'react'
import { ArrowUp, CheckIcon, CopyIcon } from '@/components/icons'
import { sfx } from '@/components/motion/sfx'
import { INTRO_REPLAY_EVENT } from '@/components/intro/events'

export function CopyEmail({ email, labels }: { email: string; labels: { copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type='button'
      className='btn'
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email)
          sfx.play('confirm')
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          sfx.play('error')
          window.location.href = `mailto:${email}`
        }
      }}
    >
      <span aria-live='polite'>{copied ? labels.copied : labels.copy}</span>
      {copied ? <CheckIcon className='btn-icon' /> : <CopyIcon className='btn-icon' />}
    </button>
  )
}

export function ReplayIntro({ label }: { label: string }) {
  return (
    <button
      type='button'
      className='link text-left'
      onClick={() => {
        sfx.play('select')
        window.scrollTo(0, 0)
        window.dispatchEvent(new Event(INTRO_REPLAY_EVENT))
      }}
    >
      {label}
    </button>
  )
}

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type='button'
      className='group flex items-center gap-2 text-left'
      onClick={() => {
        sfx.play('whoosh')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <span className='link'>{label}</span>
      <ArrowUp className='transition-transform duration-300 ease-out group-hover:-translate-y-1' />
    </button>
  )
}
