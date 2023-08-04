'use client'

import { useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { Button, Input, Spacer, Textarea } from '@nextui-org/react'

export default function ContactForm({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'contact')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)

    const res = await fetch('https://formspree.io/f/meqboqpk', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: 'application/json',
      },
    })
    if (!res.ok) {
      setError(t('errorMessage'))
    } else {
      setIsSent(true)
    }

    setIsSending(false)
  }

  return (
    <form className='lg:grid lg:grid-cols-2 flex flex-col gap-4' onSubmit={sendMessage}>
      <Input
        label={t('yourName')}
        className='col-span-2'
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        isRequired
      />
      <Input
        label={t('yourEmail')}
        type='email'
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        isRequired
      />
      <Input
        label={t('yourPhone')}
        type='tel'
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        isRequired
      />
      <Textarea
        label={t('yourMessage')}
        className='col-span-2'
        isRequired
        minRows={10}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      {isSent ? (
        <p className='text-success-500 text-sm max-w-xs'>{t('sentMessage')}</p>
      ) : error ? (
        <p className='text-danger-500 text-sm'>{error}</p>
      ) : (
        <Spacer />
      )}
      <Button
        variant='shadow'
        color={isSent ? 'success' : 'primary'}
        type='submit'
        isLoading={isSending}
      >
        {t('send')}
      </Button>
    </form>
  )
}
