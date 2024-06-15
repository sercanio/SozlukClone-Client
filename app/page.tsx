import { Metadata, ResolvingMetadata } from 'next/types';
import { getServerSession, Session } from 'next-auth';
import { Box, Container, Flex, Text } from '@mantine/core';
import Link from 'next/link';
import TitlesService from '@services/titlesService/titlesService';
import GlobalSettingsService from '@services/globalSettingsService/globalSettingsService';
import { options } from './api/auth/[...nextauth]/options';
import EntryInput from './components/Entry/EntryInput';
import { TitlesGetAllResponse } from '@/types/DTOs/TitlesDTOs';

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
  const titleService = new TitlesService(params.session!);

  const response: TitlesGetAllResponse = await titleService.getAll();
  const titles = [...(await response.items)];

  const titleSearchTerm = searchParams.baslik;
  return (
    <Container size="lg" px="lg" component="main">
      <Flex align="flex-start" justify="flex-start">
        <Box>
          <ul>
            {titles.map((title) => (
              <li key={title.slug}>
                <Link href={`/baslik/${title.slug}`} className="link">
                  {title.name} - {title?.entryCount}
                </Link>
              </li>
            ))}
          </ul>
        </Box>
        <Box>
          <Text component="h1" size="xl" fw="bold">
            {titleSearchTerm}
          </Text>
          <Text component="p" size="md">
            böyle bir başlık yok
          </Text>
          <EntryInput newTitle={titleSearchTerm || ''} />
        </Box>
      </Flex>
    </Container>
  );
}
