import Link from 'next/link';
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
import './override.css';
import EntriesService from '@/services/entryService/entryService';
import EntryCard from '@/app/components/Entry/EntryCard';

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
  const titlesService = new TitlesService(session!);

  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(slug[0]);

  return (
    <>
      <Text component="h1" size="xl" px="xl" fw="bold">
        {title.name}
      </Text>
      <Flex direction="column" justify="space-between" gap="xl">
        <Box>
          {title.entries.length > 0 &&
            title.entries.map((entry, index) => (
              <EntryCard key={entry.id} entry={entry} index={index} session={session} />
            ))}
        </Box>
        <EntryInput titleId={title.id} />
      </Flex>
    </>
  );
}
