'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SessionProvider } from 'next-auth/react'
import Guard from '@/components/Guard'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider
        enableSystem
      >
        <SessionProvider>
          <Guard>{children}</Guard>
        </SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
