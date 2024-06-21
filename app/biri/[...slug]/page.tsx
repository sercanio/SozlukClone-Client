import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { Box, Divider, Flex, NavLink, Paper, Text } from '@mantine/core';
import { Session } from 'next-auth/core/types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { options } from '@api/auth/[...nextauth]/options';
import AuthorsService from '@services/authorsService/authorsService';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import EntriesService from '@/services/entryService/entryService';
import EntryCard from '@/app/components/Entry/EntryCard';
import AuthorEditBio from '@/app/components/Author/AuthorEditBio';
import FollowingOperation from '@/app/components/Author/FollowingOperation';

type Props = {
  params: { id: string; session: Session; slug: string; author: AuthorsGetByIdResponse };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const session = await getServerSession(options);

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
  const session = await getServerSession(options);

  const authorsService = new AuthorsService(session!);
  const author = await authorsService.getByUserName(params.slug[0]);  
  const me = await authorsService.getByUserName(session?.user?.name!);

  const entriesService = new EntriesService(session!);
  const entries = await entriesService.getAllByAuthorId(0, 10, author.id)

  return (
    <Box p="xs" w={880}>
      {author && (
        <Flex px="xl" direction="column" w="100%">
          <Box pos="relative" h={150}>
            <Image src={'/assets/default/images/user/cover.png'} alt={`${author.userName} adlı yazarın kapak fotografı`} fill={true} />
          </Box>
          <Flex justify="space-between">
            <Flex p="xl" direction="column" gap="xl" flex={1}>
              <Link href={`/?baslik=${author.userName}`}><Text fw="bold" size="xl">{author.userName}</Text></Link>
              {/* <Text fw="normal" style={{ fontFamily: "sans-serif" }}>{author.biography && `"${author.biography}"`}</Text> */}
              <Flex direction="column" align="flex-start" gap="xs">
                <Text fw="normal">{author.biography || ""}</Text>
                <AuthorEditBio author={author} />
              </Flex>
              <Flex pos="relative" gap="lg" align="center" w="100%">
                <Text fw="normal">{author.entryCount} tanım</Text>
                <Text fw="normal">{author.titleCount} başlık</Text>
                <Text fw="normal">{author?.followings?.length || 0} takip</Text>
                <Text fw="normal">{author?.followers?.length || 0} takipçi</Text>
                {author.userId !== session?.user?.id && <FollowingOperation authorId={author.id} followings={me.followings} />}
              </Flex>
            </Flex>
            <Box pos="relative"
              w={96}
              h={96}
              style={{ position: "relative", zIndex: '0', borderRadius: '100%', overflow: 'hidden', bottom: "50%", transform: "translate(-1rem, -50%)" }}>
              <Image
                src={'/assets/default/images/user/profile.jpg'}
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
              session={session as Session}
              title={entry.title}
            />
            )
            }
          </>
        </Flex>
      )
      }
      {
        !author &&
        <Flex align="center" justify="center">
          <Paper withBorder shadow="xs" p="xl">
            <Text>böyle bir yazar yok</Text>
          </Paper>
        </Flex>
      }
    </Box >
  );
}
