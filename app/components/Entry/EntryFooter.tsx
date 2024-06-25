'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLeftFrameTrigger } from '@/store/triggerStore';
import { Box, Button, Flex, Menu, Text } from '@mantine/core';
import EntriesService from '@services/entryService/entryService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import { EntryInTitle } from '@/types/DTOs/EntriesDTOs';
import formatDate from '@/utils/FormatDate';
import { IconSquareArrowDown, IconSquareArrowUp, IconHeart, IconSquareArrowUpFilled, IconSquareArrowDownFilled, IconHeartFilled } from '@tabler/icons-react';
import RatingsService from '@/services/ratingsService/ratingsService';
import { RatingsCreateRequest } from '@/types/DTOs/RatingsDTOs';

export default function EntryFooter({ entry }: { entry: EntryInTitle }) {
  const session = useSession();
  const router = useRouter();

  const user = session.data?.user;
  const entriesService = new EntriesService(session.data!);
  const ratingsService = new RatingsService(session.data!);

  const setLeftFrameTrigger = useLeftFrameTrigger((state) => state.setTrigger);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const liked = entry.authorLike;
  const disliked = entry.authorDislike;
  const favorited = entry.authorFavorite;

  console.log(entry);
  
  async function handleEntryDelete() {
    showSpinnerOverlay();
    try {
      await entriesService.delete(entry.id);
      showNotification({
        title: 'başarılı',
        message: 'tanım başarıyla silindi',
        variant: 'success',
      });
      router.refresh();
      setLeftFrameTrigger();
    } catch (err: any) {
      showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  // async function handleLike() {
  //   showSpinnerOverlay();
  //   try {
  //     if (dislike) {
  //       await ratingsService.deleteDislike(`${dislike.id}`);
  //     }

  //     if (like) {
  //       await ratingsService.deleteLike(`${like.id}`);
  //       showNotification({ title: 'başarılı', message: 'tanım beğenisi kaldırıldı', variant: 'success' });
  //     } else {
  //       const likeData: RatingsCreateRequest = {
  //         entryId: entry.id,
  //         authorId: user?.authorId as number,
  //       };
  //       await ratingsService.createLike(likeData);
  //       showNotification({ title: 'başarılı', message: 'tanım beğenildi', variant: 'success' });
  //     }

  //   } catch (err: any) {
  //     showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
  //   } finally {
  //     router.refresh();
  //     hideSpinnerOverlay();
  //   }
  // }

  // async function handleDislike() {
  //   showSpinnerOverlay();
  //   try {
  //     if (like) {
  //       await ratingsService.deleteLike(`${like.id}`);
  //     }

  //     if (favorite) {
  //       await ratingsService.deleteFavorite(`${favorite.id}`)
  //     }

  //     if (dislike) {
  //       await ratingsService.deleteDislike(`${dislike.id}`);
  //       showNotification({ title: 'başarılı', message: 'tanıma eksi oyu kaldırıldı', variant: 'success' });
  //     } else {
  //       const dislikeData: RatingsCreateRequest = {
  //         entryId: entry.id,
  //         authorId: user?.authorId as number,
  //       };
  //       await ratingsService.createDislike(dislikeData);
  //       showNotification({ title: 'başarılı', message: 'tanıma eksi oy verildi', variant: 'success' });
  //     }

  //   } catch (err: any) {
  //     showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
  //   } finally {
  //     router.refresh();
  //     hideSpinnerOverlay();
  //   }
  // }

  // async function handleFavorite() {
  //   showSpinnerOverlay();
  //   try {
  //     if (dislike) {
  //       await ratingsService.deleteDislike(`${dislike.id}`);
  //     }


  //     if (favorite) {
  //       await ratingsService.deleteFavorite(`${favorite.id}`);
  //       showNotification({ title: 'başarılı', message: 'tanım favorilerden kalıdırıldı', variant: 'success' });
  //     } else {
  //       const favoriteData: RatingsCreateRequest = {
  //         entryId: entry.id,
  //         authorId: user?.authorId as number,
  //       };
  //       await ratingsService.createFavorite(favoriteData);
  //       showNotification({ title: 'başarılı', message: 'tanım favorilere eklendi', variant: 'success' });
  //     }

  //   } catch (err: any) {
  //     showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
  //   } finally {
  //     router.refresh();
  //     hideSpinnerOverlay();
  //   }
  // }
  
  return (
    <Flex direction="column" justify="flex-end" align="flex-end" gap="md">
      <Flex gap="sm" justify="space-between" w="100%">
        <Flex flex={1} gap="xl">
          <Flex gap="xs" align="center">
            <Button variant='transparent' p="none">
              {
                liked ?
                  <IconSquareArrowUpFilled stroke={0.5} /> : <IconSquareArrowUp stroke={0.5} />
              }
            </Button>
            <Text>{entry.likesCount}</Text>
          </Flex>
          <Flex gap="xs" align="center">
            <Button variant='transparent' p="none">
              {
                disliked ?
                  <IconSquareArrowDownFilled stroke={0.5} /> : <IconSquareArrowDown stroke={0.5} />
              }
            </Button>
            <Text>{entry.dislikesCount}</Text>
          </Flex>
          <Flex gap="xs" align="center">
            <Button variant='transparent' p="none">
              {
                favorited ?
                  <IconHeartFilled stroke={0.5} /> : <IconHeart stroke={0.5} />
              }
            </Button>
            <Text>{entry.favoritesCount}</Text>
          </Flex>
        </Flex>
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <Button variant="transparent">
              <Text>...</Text>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {user?.id === entry.author?.userId && (
              <Menu.Item onClick={handleEntryDelete}>sil</Menu.Item>
            )}
            {user?.id === entry.author?.userId && <Menu.Item><Link href={`/tanim/guncelle/${entry.id}`}>güncelle</Link></Menu.Item>}
            <Menu.Item>modlog</Menu.Item>
            <Menu.Item>şikayet</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <Flex gap="md" style={{ width: 'fit-content' }}>
        <Flex direction="column" justify="center" align="flex-end" gap="sm">
          <Link href={`/biri/${entry.author?.userName}`}>
            <Text ta="right" fw={500}>{entry.author?.userName}</Text>
          </Link>
          <Link href={`/tanim/${entry.id}`} style={{ color: 'unset' }}>
            <Text ta="right" size="xs">
              {formatDate(entry.createdDate)}
              {entry.updatedDate && ` - ${formatDate(entry?.updatedDate)}`}
            </Text>
          </Link>
        </Flex>
        <Box
          pos="relative"
          w={52}
          h={52}
          style={{ zIndex: '0', borderRadius: '100%', overflow: 'hidden' }}
        >
          <Link href={`/biri/${entry.author?.userName}`}>
            <Image
              src={'/assets/default/images/user/profile.jpg'}
              fill
              objectFit="cover"
              alt={`${entry.author?.userName} profil fotografı`}
            />
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
}
