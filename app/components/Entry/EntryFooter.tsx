'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useLeftFrameTrigger } from '@/store/triggerStore';
import { Box, Button, Flex, Menu, Text } from '@mantine/core';
import EntriesService from '@services/entryService/entryService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import { EntryInTitle } from '@/types/DTOs/EntriesDTOs';
import formatDate from '@/utils/FormatDate';
import { usePathname, useRouter } from 'next/navigation';

export default function EntryFooter({ entry }: { entry: EntryInTitle }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session.data?.user;
  const entriesService = new EntriesService(session.data!);

  const setLeftFrameTrigger = useLeftFrameTrigger((state) => state.setTrigger);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  console.log(pathname);


  async function handleEntryDelete() {
    showSpinnerOverlay();
    try {
      await entriesService.delete(entry.id);
      showNotification({
        title: 'başarılı',
        message: 'tanım başarıyla silindi',
        variant: 'success',
      });
      router.refresh()
      setLeftFrameTrigger();
    } catch (err: any) {
      showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  return (
    <Flex direction="column" justify="flex-end" align="flex-end" gap="md">
      <Menu shadow="md" width={150}>
        <Menu.Target>
          <Button variant="transparent">
            <Text fw={600}>...</Text>
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
      <Flex gap="md" style={{ width: 'fit-content' }}>
        <Flex direction="column" justify="center" align="flex-end" gap="sm">
          <Link href={`/biri/${entry.author?.userName}`}>
            <Text ta="right" fw={500}>{entry.author?.userName}</Text>
          </Link>
          <Link href={`/tanim/${entry.id}`} style={{ color: 'unset' }}>
            <Text ta="right" size="xs">
              {formatDate(entry.createdDate)}
              {entry.updatedDate && `- ${formatDate(entry?.updatedDate)}`}
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
              src={entry.author?.profilePictureUrl || '/assets/default/images/user/profile.jpg'}
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
