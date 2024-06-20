import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { Box, Button, Container, Divider, Flex, NavLink, Paper, Popover, Text } from '@mantine/core';
import { Session } from 'next-auth/core/types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { options } from '@api/auth/[...nextauth]/options';
import AuthorsService from '@services/authorsService/authorsService';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import EntriesService from '@/services/entryService/entryService';
import { EntriesGetAllResponse } from '@/types/DTOs/EntriesDTOs';
import EntryCard from '@/app/components/Entry/EntryCard';
import AuthorEditBio from '@/app/components/Author/AuthorEditBio';

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

  const entriesService = new EntriesService(session!);
  const entries = await entriesService.getAllByAuthorId(0, 10, author.id)

  return (
    <Box p="xs" w={880}>
      {author && (
        <Flex px="xl" direction="column" w="100%">
          <Box pos="relative" h={150}>
            <Image src={author.coverPictureUrl || '/assets/default/images/user/cover.png'} alt={`${author.userName} adlı yazarın kapak fotografı`} fill={true} />
          </Box>
          <Flex justify="space-between">
            <Flex p="xl" direction="column" gap="xl">
              <Link href={`/?baslik=${author.userName}`}><Text fw="bold" size="xl">{author.userName}</Text></Link>
              {/* <Text fw="normal" style={{ fontFamily: "sans-serif" }}>{author.biography && `"${author.biography}"`}</Text> */}
              <Flex direction="column" align="flex-start" gap="xs">
                <Text fw="normal">{author.biography || ""}</Text>
                <AuthorEditBio author={author} />
              </Flex>
              <Flex gap="lg">
                <Text fw="normal">{author.entryCount} tanım</Text>
                <Text fw="normal">{author.titleCount} başlık</Text>
                <Text fw="normal">{author?.followeesCount || 0} takip</Text>
                <Text fw="normal">{author?.followersCount || 0} takipçi</Text>
              </Flex>
            </Flex>
            <Box pos="relative"
              w={96}
              h={96}
              style={{ position: "relative", zIndex: '0', borderRadius: '100%', overflow: 'hidden', bottom: "50%", transform: "translate(-1rem, -50%)" }}>
              <Image
                src={author?.profilePictureUrl || '/assets/default/images/user/profile.jpg'}
                fill
                objectFit="cover"
                alt={`${author?.userName} adlı yazarın profil fotografı`}
              />
            </Box>
          </Flex>
          <Divider my="none" />
          <Flex px="md" gap="sm">
            <NavLink color="cyan.4" variant="light" autoContrast label="tanımları" w="fit-content" />
            <NavLink color="cyan.4" variant="light" autoContrast label="favorileri" w="fit-content" />
          </Flex>
          <Divider my="none" />
          <>
            {entries.items.map((entry, index) => <EntryCard
              key={entry.id}
              entry={entry}
              index={index}
              session={session}
              title={entry.title}
            />
            )
            }
          </>
        </Flex>
      )
      }
      {!author &&
        <Flex align="center" justify="center">
          <Paper withBorder shadow="xs" p="xl">
            <Text>böyle bir yazar yok</Text>
          </Paper>
        </Flex>}
    </Box >
  );
}
