import { Metadata, ResolvingMetadata } from 'next/types';
import { getServerSession, Session } from 'next-auth';
import { Box, Container, Text } from '@mantine/core';
import GlobalSettingsService from '@services/globalSettingsService/globalSettingsService';
import { options } from './api/auth/[...nextauth]/options';
import EntryInput from './components/Entry/EntryInput';

type Props = {
  params: { id: string; session: Session };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const session = await getServerSession(options);
  params.session = session!;

  const globalSettingsService = new GlobalSettingsService(session!);
  const globalSettings = await globalSettingsService.getById(1);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${globalSettings.siteName} - ${globalSettings.siteDescription}`,
    openGraph: {
      images: [`${globalSettings.siteLogo}`, ...previousImages],
    },
  };
}

export default async function HomePage({ params, searchParams }: Props) {
  const titleSearchTerm = searchParams.baslik;
  return (
    <Box>
      <Text component="h1" size="xl" fw="bold">
        {titleSearchTerm}
      </Text>
      <Text component="p" size="md">
        böyle bir başlık yok
      </Text>
      <EntryInput newTitle={titleSearchTerm} />
    </Box>
  );
}
