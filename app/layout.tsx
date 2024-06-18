import '@mantine/core/styles.css';
import React, { Suspense } from 'react';
import { Metadata } from 'next/types';
import { Session, getServerSession } from 'next-auth';
import { HeaderMenu } from '@components/Header/Header';
import Toaster from '@components/Toaster/Toaster';
import { Box, Container, Flex } from '@mantine/core';
import LoadingSpinner from '@components/LoadingOverlay/LoadingSpinner';
import GlobalSettingsService from '@services/globalSettingsService/globalSettingsService';
import { Providers } from './provider';
import { options } from './api/auth/[...nextauth]/options';
import LeftFrame from './components/LeftFrame/LeftFrame';
import './override.css';

type Props = {
  children: React.ReactNode;
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

export default async function RootLayout({ children }: Props) {

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers>
          <HeaderMenu />
          <Container size="xl" px="xl" my="xl" component="main" h="100%">
            <Flex align="flex-start" justify="flex-start" h="100%">
              <LeftFrame />
              <Box component="main" ml="290px" mt="85px" px="md" w="100%">
                {children}
              </Box>
            </Flex>
          </Container>
          <Toaster />
          <LoadingSpinner />
        </Providers>
      </body>
    </html>
  );
}
