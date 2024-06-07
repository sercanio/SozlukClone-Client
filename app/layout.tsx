import '@mantine/core/styles.css';
import React from 'react';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from './provider';
import { HeaderMenu } from '@/shared/components/header/Header';
import './override.css';
import Toaster from '@/core/components/Toaster/Toaster';
import LoadingSpinner from '@/core/components/LoadingOverlay/LoadingSpinner';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default async function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <ColorSchemeScript defaultColorScheme="auto" />
        <Providers>
          <HeaderMenu />
          {children}
          <Toaster />
          <LoadingSpinner />
        </Providers>
      </body>
    </html>
  );
}
