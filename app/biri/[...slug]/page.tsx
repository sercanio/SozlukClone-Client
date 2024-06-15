import { Container, Paper, Text } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth/core/types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { options } from '@api/auth/[...nextauth]/options';
import AuthorsService from '@services/authorsService/authorsService';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';

type Props = {
  params: { id: string; session: Session; slug: string; author: AuthorsGetByIdResponse };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const session = await getServerSession(options);
  params.session = session!;

  const authorsService = new AuthorsService(session!);
  const author = await authorsService.getByUserName(params.slug[0]);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Yazar ${params.slug}`,
    openGraph: {
      images: [`${author.profilePictureUrl}`, ...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const { session } = params;
  const authorsService = new AuthorsService(session!);
  const author = await authorsService.getByUserName(params.slug[0]);

  return (
    <Container size="lg" px="lg" component="main">
      <Paper shadow="xs" p="xs" withBorder>
        <Text>Paper is the most basic ui component</Text>
        {author && (
          <>
            <Text>Username: {author.userName}</Text>
            <Text>Role: {author.authorGroupId}</Text>
          </>
        )}
        {!author && <Text>author not found</Text>}
      </Paper>
    </Container>
  );
}
