import { Card, CardBody } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { title } from '@/components/primitives'
import { useTranslation } from '@/app/i18n'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'

export default async function Home({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'home')

  return (
    <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
      <Card
        shadow='md'
        className='border-none bg-background/60 dark:bg-default-100/50 md:max-w-4xl max-w-2xl'
      >
        <CardBody>
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
              <h1 className={title({ size: 'sm' })}>
                {t('greet')}
                <span className={title({ color: 'violet', size: 'sm' })}>Sinan Karakaya</span>
              </h1>
              <div className='mt-6 leading-6 indent-8'>
                <p>{t('body')}</p>
              </div>
              <div className='flex gap-x-4 justify-end mt-10'>
                <Button
                  variant='shadow'
                  color='primary'
									as={Link}
									href='/about'
                >
                  {t('learnMore')}
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
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  )
}
