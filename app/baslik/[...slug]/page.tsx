import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex, Paper, Text } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth/core/types';
import { Metadata } from 'next/types';
import TitlesService from '@services/titlesService/titlesService';
import EntryInput from '@components/Entry/EntryInput';
import EntryFooter from '@components/Entry/EntryFooter';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import formatDate from '@/utils/FormatDate';
import './override.css';
import EntriesService from '@/services/entryService/entryService';

type Props = {
  params: { id: string; session: Session; slug: string; author: AuthorsGetByIdResponse };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await getServerSession(options);
  const titlesService = new TitlesService(session!);
  params.session = session!;

  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(params.slug[0]);

  return {
    title: `${title.name}`,
  };
}

export default async function Page({ params }: Props) {
  const { session, slug } = params;
  const entriesService = new EntriesService(session!);
  const titlesService = new TitlesService(session!);

  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(slug[0]);

  return (
    <>
      <Text component="h1" size="xl" px="xl" fw="bold">
        {title.name}
      </Text>
      {title.entries.length > 0 &&
        title.entries.map((entry, index) => (
          <Paper shadow="none" p="xl" my="md" key={index}>
            <Flex direction="column" justify="flex-start" gap="xl">
              <Flex justify="space-between" gap="sm" pr="md">
                <Text size="xs" fw="lighter">
                  {index + 1}
                </Text>
                <Text size="xs" fw="light">
                  <Link href={`/entry/${entry.id}`}>#{entry.id}</Link>
                </Text>
              </Flex>
              <Box
                flex={1}
                dangerouslySetInnerHTML={{
                  __html: entriesService.formatEntryContent(entry.content),
                }}
              />
              <Text id="entry" flex={1}></Text>
              <Flex justify="flex-end">
                <EntryFooter entry={entry} />
              </Flex>
              <Flex justify="flex-end" gap="md">
                <Flex direction="column" gap="xs" style={{ width: 'fit-content' }}>
                  <Link href={`/biri/${entry.author?.userName}`}>
                    <Text ta="right">{entry.author?.userName}</Text>
                  </Link>
                  <Text ta="right" size="xs">
                    {formatDate(entry.createdDate)}
                    {entry.updatedDate && `- ${formatDate(entry?.updatedDate)}`}
                  </Text>
                </Flex>
                <Box
                  pos="relative"
                  w={52}
                  h={52}
                  style={{ border: '1px solid red', borderRadius: '100%', overflow: 'hidden' }}
                >
                  <Image
                    src={entry.author?.profilePictureUrl || '/images/default-profile-picture.jpg'}
                    fill
                    objectFit="cover"
                    alt={`${entry.author?.userName} profil fotografı`}
                  />
                </Box>
              </Flex>
            </Flex>
          </Paper>
        ))}
      <EntryInput titleId={title.id} />
    </>
  );
}
