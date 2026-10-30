'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute='data-theme'
      themes={['ink', 'bone']}
      defaultTheme='ink'
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
