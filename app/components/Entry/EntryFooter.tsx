'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Button, Flex, Menu, Text } from '@mantine/core';
import EntriesService from '@services/entryService/entryService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import { EntryInTitle } from '@/types/DTOs/EntriesDTOs';
import formatDate from '@/utils/FormatDate';

export default function EntryFooter({ entry }: { entry: EntryInTitle }) {
  const session = useSession();
  const user = session.data?.user;
  const entriesService = new EntriesService(session.data!);

  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  async function handleEntryDelete() {
    showSpinnerOverlay();
    try {
      await entriesService.delete(entry.id);
      showNotification({
        title: 'başarılı',
        message: 'tanım başarıyla silindi',
        variant: 'success',
      });
      window.location.reload();
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
          {user?.id === entry.author?.userId && <Menu.Item>güncelle</Menu.Item>}
          <Menu.Item>modlog</Menu.Item>
          <Menu.Item>şikayet</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Flex gap="md" style={{ width: 'fit-content' }}>
        <Flex direction="column" justify="center" align="flex-end" gap="sm">
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
          style={{ zIndex: '0', borderRadius: '100%', overflow: 'hidden' }}
        >
          <Image
            src={entry.author?.profilePictureUrl || '/assets/default/images/user/profile.jpg'}
            fill
            objectFit="cover"
            alt={`${entry.author?.userName} profil fotografı`}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
