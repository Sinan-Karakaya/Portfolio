'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { ArrowRight } from '@/components/icons'
import { sfx } from '@/components/motion/sfx'

export type ContactLabels = {
  yourName: string
  yourEmail: string
  yourPhone: string
  yourMessage: string
  optional: string
  send: string
  sending: string
  sentTitle: string
  sentMessage: string
  another: string
  errorMessage: string
}

const EMPTY = { name: '', email: '', phone: '', message: '' }

export default function ContactForm({ labels }: { labels: ContactLabels }) {
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(EMPTY)

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    setError('')
    sfx.play('select')

    try {
      const res = await fetch('https://formspree.io/f/meqboqpk', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error(String(res.status))
      setIsSent(true)
      setFormData(EMPTY)
      sfx.play('confirm')
    } catch {
      setError(labels.errorMessage)
      sfx.play('error')
    }

    setIsSending(false)
  }

  if (isSent) {
    return (
      <div
        role='status'
        className='module flex min-h-[26rem] flex-col justify-between p-6 lg:p-8'
      >
        <span className='label flex items-center gap-2 text-accent'>
          <span className='blink inline-block h-[7px] w-[7px] bg-volt' />
          200 — OK
        </span>
        <div>
          <p className='display wdth-125 text-[clamp(34px,4.4vw,72px)]'>{labels.sentTitle}</p>
          <p className='mt-4 max-w-[46ch] text-pretty text-muted'>{labels.sentMessage}</p>
        </div>
        <button
          type='button'
          className='btn self-start'
          onClick={() => setIsSent(false)}
        >
          {labels.another}
          <ArrowRight className='btn-icon' />
        </button>
      </div>
    )
  }

  const field = (
    key: keyof typeof EMPTY,
    n: string,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <label className='group block'>
      <span className='label flex justify-between text-muted transition-colors group-focus-within:text-fg'>
        <span>
          {n} / {label}
        </span>
        {!props.required && <span>{labels.optional}</span>}
      </span>
      <input
        className='field'
        name={key}
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        {...props}
      />
    </label>
  )

  return (
    <form
      className='grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-2'
      onSubmit={sendMessage}
    >
      <div className='md:col-span-2'>
        {field('name', '01', labels.yourName, { required: true, autoComplete: 'name' })}
      </div>
      {field('email', '02', labels.yourEmail, { required: true, type: 'email', autoComplete: 'email' })}
      {field('phone', '03', labels.yourPhone, { type: 'tel', autoComplete: 'tel' })}
      <label className='group block md:col-span-2'>
        <span className='label text-muted transition-colors group-focus-within:text-fg'>04 / {labels.yourMessage}</span>
        <textarea
          className='field min-h-[11rem] resize-y leading-relaxed'
          name='message'
          required
          rows={7}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </label>
      <div className='flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between'>
        <p
          role='alert'
          className={clsx('max-w-[52ch] text-[15px] text-signal', !error && 'sr-only')}
        >
          {error}
        </p>
        <button
          type='submit'
          className='btn btn-primary min-w-[16rem] md:ml-auto'
          disabled={isSending}
          aria-busy={isSending}
        >
          <span>{isSending ? `${labels.sending}…` : labels.send}</span>
          {isSending ? (
            <span className='relative block h-px w-10 overflow-hidden bg-ink/30'>
              <span className='absolute inset-y-0 left-0 w-1/3 animate-[sk-load_0.9s_var(--ease-in-out)_infinite] bg-ink' />
            </span>
          ) : (
            <ArrowRight className='btn-icon' />
          )}
        </button>
      </div>
    </form>
  )
}
