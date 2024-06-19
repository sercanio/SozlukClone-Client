'use client';

import { SessionProvider } from 'next-auth/react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <SessionProvider>
        <MantineProvider theme={theme} defaultColorScheme="auto"
        >
          {children}
        </MantineProvider>
      </SessionProvider >
    </>
  );
}
