import { Box, Flex, Text } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth/core/types';
import { Metadata } from 'next/types';
import TitlesService from '@services/titlesService/titlesService';
import EntryInput from '@components/Entry/EntryInput';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import './override.css';
import EntryCard from '@/app/components/Entry/EntryCard';
import EntryPagination from '@/app/components/Entry/EntryPagination';

type Props = {
  params: { id: string; session: Session; slug: string; author: AuthorsGetByIdResponse };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const session = await getServerSession(options);
  const titlesService = new TitlesService(session!);
  params.session = session!;

  const { page, size } = searchParams
  const pageParam: number = page ? +page - 1 : 0;
  const sizeParam: number = size ? +size : 10;

  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(params.slug[0], pageParam, sizeParam);

  return {
    title: `${title.name}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { session, slug } = params;

  const { page, size } = searchParams
  const pageParam: number = page ? +page - 1 : 0;
  const sizeParam: number = size ? +size : 10;

  const titlesService = new TitlesService(session!);
  const title = await titlesService.getBySlug<TitlesGetByIdResponse>(slug[0], pageParam, sizeParam);

  return (
    <>
      <Text component="h1" size="xl" px="xl" fw="bold">
        {title.name}
      </Text>
      <Flex pos="relative" direction="column" justify="space-between" gap="xl">
        <Box w="100%" >
          <EntryPagination title={title} page={pageParam} size={sizeParam} />
          {title.entries.length > 0 &&
            title.entries.map((entry, index) => (
              <EntryCard key={entry.id} entry={entry} index={pageParam * sizeParam + index} session={session} />
            ))}
          <EntryPagination title={title} page={pageParam} size={sizeParam} />
        </Box>
        <EntryInput titleId={title.id} />
      </Flex>
    </>
  );
}
