import '@mantine/core/styles.css';
import React from 'react';
import { Metadata } from 'next/types';
import { Session, getServerSession } from 'next-auth';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from './provider';
import { HeaderMenu } from '@/shared/components/header/Header';
import './override.css';
import Toaster from '@/core/components/Toaster/Toaster';
import LoadingSpinner from '@/core/components/LoadingOverlay/LoadingSpinner';
import GlobalSettingsService from '@/shared/services/globalSettingsService/globalSettingsService';
import { options } from './api/auth/[...nextauth]/options';

type Props = {
  params: { id: string; session: Session };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await getServerSession(options);
  params.session = session!;

  const globalSettingsService = new GlobalSettingsService(session!);
  const globalSettings = await globalSettingsService.getById(1);

  const favicon = globalSettings.siteFavIcon || '/favicon.ico';
  return {
    title: {
      template: `%s - ${globalSettings.siteName}`,
      default: `${globalSettings.siteName} - ${globalSettings.siteDescription}`,
    },
    icons: {
      icon: '/icon.png',
      shortcut: favicon,
      apple: '/apple-icon.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    },
  };
}

export default async function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
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
