import { useTranslation } from '@/app/i18n'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Divider } from '@nextui-org/divider'
import { title } from '@/components/primitives'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'
import { Spacer } from '@nextui-org/spacer'
import Timeline from '@/components/Timeline'

export default async function About({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'about')

  return (
    <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
      <Card
        shadow='md'
        className='border-none bg-background/60 dark:bg-default-100/50 md:max-w-4xl max-w-2xl'
      >
        <CardHeader>
          <div className='grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-start justify-center'>
            <div className='relative col-span-6 md:col-span-4'>
              <Image
                alt='My portrait'
                className='object-cover'
                height={200}
                shadow='md'
                width={'100%'}
                src='/assets/images/me.webp'
                isBlurred
                isZoomed
              />
            </div>

            <div className='flex flex-col col-span-6 md:col-span-8'>
              <h1 className={title({ size: 'sm' })}>{t('title')}</h1>
              <div className='mt-6 leading-6 indent-8'>
                <p>{t('body')}</p>
              </div>
              <div className='flex gap-x-4 justify-end mt-8'></div>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className='indent-8'>{t('body2')}</p>
          <Spacer y={4} />
          <p className='indent-8'>{t('body3')}</p>
          <Spacer y={4} />
          <p className='indent-8'>{t('body4')}</p>
          <Spacer y={4} />
          <p className='indent-8'>{t('body5')}</p>
          <Spacer y={4} />
          <p className='indent-8'>{t('body6')}</p>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className='grid grid-cols-2 md:grid-cols-6 w-full gap-4 items-center'>
            <Timeline lng={lng} />
            <Button
              variant='shadow'
              color='primary'
              as={Link}
              href={`/assets/SinanKarakaya_CV_${lng}.pdf`}
              isExternal
            >
              {t('cv')}
            </Button>
            <Button
              variant='shadow'
              color='primary'
              as={Link}
              href='/projects'
            >
              {t('projects')}
            </Button>
            <Button
              variant='shadow'
              color='secondary'
              as={Link}
              href='/contact'
            >
              {t('contact')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  )
}
