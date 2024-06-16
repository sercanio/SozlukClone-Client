'use client';

import { useSession } from 'next-auth/react';
import { Button, Menu, Text } from '@mantine/core';
import EntriesService from '@services/entryService/entryService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import { EntryInTitle } from '@/types/DTOs/EntriesDTOs';

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
  );
}
