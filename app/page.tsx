import { Metadata, ResolvingMetadata } from 'next/types';
import { getServerSession, Session } from 'next-auth';
import { Box, Flex, Text } from '@mantine/core';
import GlobalSettingsService from '@services/globalSettingsService/globalSettingsService';
import { options } from './api/auth/[...nextauth]/options';
import EntryInput from './components/Entry/EntryInput';
import EntriesService from '@/services/entryService/entryService';
import { EntriesGetAllResponse } from '@/types/DTOs/EntriesDTOs';
import EntryCard from './components/Entry/EntryCard';
import TitlesService from '@/services/titlesService/titlesService';
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import { redirect } from 'next/navigation';

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

  const { session } = params;
  const entriesService = new EntriesService(session!);
  const titleService = new TitlesService(session!);

  const title: TitlesGetByIdResponse = await titleService.getByName(titleSearchTerm as string).then((res) => {
    return res;
  }).catch(err => {
    console.log(err.message)
    return null;
  }) as TitlesGetByIdResponse;


  title && redirect(`baslik/${title.slug}`);

  const entries: EntriesGetAllResponse = await entriesService.getAllForHomePage(0, 10);

  return (
    <Flex direction="column" justify="space-between" gap="xl">
      {titleSearchTerm ? (
        <>
          <Text component="h1" size="xl" fw="bold" px="lg">
            {titleSearchTerm}
          </Text>
          <Text component="p" size="md" px="lg">
            böyle bir başlık yok
          </Text>
          <EntryInput newTitle={titleSearchTerm} />
        </>
      ) : (
        <>
          {entries.items.length > 0 &&
            entries.items.map((entry, index) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={index}
                session={session}
                title={entry.title}
              />
            ))}
        </>
      )}
    </Flex>
  );
}
