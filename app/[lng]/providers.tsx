'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SessionProvider } from 'next-auth/react'
import Guard from '@/components/Guard'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider
        enableSystem
        {...themeProps}
      >
        <SessionProvider>
          <Guard>{children}</Guard>
        </SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
