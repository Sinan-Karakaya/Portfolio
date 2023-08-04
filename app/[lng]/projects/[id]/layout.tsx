import { useTranslation } from '@/app/i18n'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'

export default async function ProjectLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'projects')
  return (
    <div className='max-w-screen-lg'>
      <div className='w-full mb-4'>
        <Button
          variant='shadow'
          color='primary'
          as={Link}
          href='/projects'
          size='lg'
        >
          {t('back')}
        </Button>
      </div>
      {children}
    </div>
  )
}
