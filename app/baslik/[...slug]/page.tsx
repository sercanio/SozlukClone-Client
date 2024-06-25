import { Box, Flex, Text } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth/core/types';
import { Metadata } from 'next/types';
import TitlesService from '@services/titlesService/titlesService';
import EntryInput from '@components/Entry/EntryInput';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import EntryCard from '@/app/components/Entry/EntryCard';
import EntryPagination from '@/app/components/Entry/EntryPagination';
import EntriesService from '@/services/entryService/entryService';

type Props = {
  params: { id: string; session: Session; slug: string; author: AuthorsGetByIdResponse };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const session = await getServerSession(options);
  const titlesService = new TitlesService(session!);

  const { page, size } = searchParams
  const pageParam: number = page ? +page - 1 : 0;
  const sizeParam: number = size ? +size : 10;

  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(params.slug[0]);

  return {
    title: `${title.name}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = params;

  const { page, size } = searchParams
  const pageParam: number = page ? +page - 1 : 0;
  const sizeParam: number = size ? +size : 10;

  const session = await getServerSession(options);
  const titlesService = new TitlesService(session!);
  const entriesService = new EntriesService(session!);

  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(slug[0]);
  const entries = await entriesService.getAllByTitleId(pageParam, sizeParam, title.id)

  return (
    <>
      <Text component="h1" size="xl" px="xl" fw="bold">
        {title.name}
      </Text>
      <Flex pos="relative" direction="column" justify="space-between" gap="xl">
        <>
        <EntryPagination pages={entries.pages} title={title} page={pageParam} size={sizeParam} />
        {entries.items.length > 0 &&
            entries.items.map((entry, index) => (
              <EntryCard key={entry.id} entry={entry} index={pageParam * sizeParam + index} session={session!} singleEntry={false} />
            ))}
          <EntryPagination pages={entries.pages} title={title} page={pageParam} size={sizeParam} />
        </>
        <EntryInput titleId={title.id} />
      </Flex>
    </>
  );
}
