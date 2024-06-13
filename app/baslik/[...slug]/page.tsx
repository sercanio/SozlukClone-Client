import Image from 'next/image';
import { Box, Container, Flex, Paper, Text } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth/core/types';
import { Metadata } from 'next/types';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import TitlesService from '@/shared/services/titlesService/titlesService';
import EntryInput from '@/shared/components/entry/EntryInput';
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import formatDate from '@/utils/FormatDate';

type Props = {
  params: { id: string; session: Session; slug: string; author: AuthorsGetByIdResponse };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const session = await getServerSession(options);
  params.session = session!;

  const title = params.slug[0].split('--')[0];
  // get by slug

  return {
    title: `${title}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { session, slug } = params;
  const titlesService = new TitlesService(session!);
  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(slug[0]);

  return (
    <Container size="lg" px="lg" component="main">
      <Text component="h1" size="xl" fw="bold">
        {title.name}
      </Text>
      {title.entries.map((entry) => (
        <Paper shadow="none" p="xl" my="xl" withBorder>
          <Flex direction="column" justify="space-between">
            <Text flex={1} pt="sm" pb="xl">
              {entry.content}
            </Text>
            <Flex gap="md" justify="flex-end">
              <Flex direction="column" gap="xs" style={{ width: 'fit-content' }}>
                <Text ta="right">{entry.author.userName}</Text>
                <Text ta="right" size="xs">
                  {formatDate(entry.createdDate)}{' '}
                  {entry.updatedDate && `- ${formatDate(entry.updatedDate)}`}
                </Text>
              </Flex>
              <Box
                pos="relative"
                w={52}
                h={52}
                style={{ border: '1px solid red', borderRadius: '100%', overflow: 'hidden' }}
              >
                <Image
                  src={entry.author.profilePictureUrl}
                  fill
                  objectFit="cover"
                  alt={`${entry.author.userName} profil fotografı`}
                />
              </Box>
            </Flex>
          </Flex>
        </Paper>
      ))}

      <EntryInput titleId={title.id} />
    </Container>
  );
}
