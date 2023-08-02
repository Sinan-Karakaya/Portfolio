'use client'

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { title } from './primitives'
import { useTranslation } from '@/app/i18n/client'

export default function Timeline({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'timeline')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const years: string[] = ['2015', '2021', '2022', '2022', '2023', '2023', '2024']

  return (
    <>
      <Button
        variant='shadow'
        color='primary'
        onPress={onOpen}
        className='md:col-start-3'
      >
        {t('timeline')}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop='blur'
        size='3xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className={title({ size: 'sm' })}>{t('timeline')}</ModalHeader>
              <ModalBody className='py-4'>
                <div className='flex gap-4'>
                  <div className='w-2 min-h-full'>
                    <Divider orientation='vertical' />
                  </div>
                  <div className='flex flex-col gap-y-1'>
                    {years.map((year, index) => (
                      <>
                        <div className='flex'>
                          <p className='font-bold underline'>{year + ':'}</p>
                          &nbsp;
                          <p>{t(`timeline${index}`)}</p>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
