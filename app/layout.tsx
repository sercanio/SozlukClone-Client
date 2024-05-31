import '@mantine/core/styles.css';
import React from 'react';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from './Provider';
import { HeaderMenu } from '@/shared/components/header/Header';
import './override.css';

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
        </Providers>
      </body>
    </html>
  );
}
