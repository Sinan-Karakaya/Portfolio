import { useTranslation } from '@/app/i18n'
import ContactForm from '@/components/ContactForm'
import { title } from '@/components/primitives'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import { Link } from '@nextui-org/link'

export default async function ContactPage({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, 'contact')

  return (
    <Card className='max-w-5xl w-full lg:w-6/12'>
      <CardHeader>
        <h1 className={`${title({ size: 'sm' })}`}>{t('title')}</h1>
      </CardHeader>
      <Divider />
      <CardBody>
        <ContactForm lng={lng} />
      </CardBody>
      <Divider />
      <CardFooter>
        <div className='text-sm text-foreground-500'>
          <p>{t('coordinates')}</p>
          <Link
            href='mailto:sinan.karakaya@epitech.eu'
            isExternal
            showAnchorIcon
          >
            sinan.karakaya@epitech.eu
          </Link>
          <br />
          <Link
            href='tel:0781984783'
            isExternal
            showAnchorIcon
          >
            +33 7 81 98 47 83
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
