'use client';

import { useState } from 'react';
import { Container, Flex, Tabs, Text, rem } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import useNotificationStore from '@/store/notificationStore';
import useLoadingStore from '@/store/loadingStore';
import './override.css';

export function Settings() {
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();
  const [activeTab, setActiveTab] = useState<string | null>('gallery');

  const { data: session } = useSession();
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Container py="none" px="sm" w="100%">
      <Flex direction="column" align="flex-start" gap={16} w="100%">
        <Text component="h1" size="xl" fw={700}>
          Sözlük Ayarları
        </Text>
        <Tabs value={activeTab} onChange={setActiveTab} w="100%">
          <Tabs.List grow>
            <Tabs.Tab value="gallery" leftSection={<IconPhoto style={iconStyle} />}>
              Gallery
            </Tabs.Tab>
            <Tabs.Tab value="messages" leftSection={<IconMessageCircle style={iconStyle} />}>
              Messages
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
              Settings
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>

          <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

          <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
        </Tabs>
      </Flex>
    </Container>
  );
}
