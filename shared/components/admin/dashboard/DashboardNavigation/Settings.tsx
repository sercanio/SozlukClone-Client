'use client';

import { useState } from 'react';
import { Container, Flex, Text, rem } from '@mantine/core';
import { useSession } from 'next-auth/react';
import useNotificationStore from '@/store/notificationStore';
import useLoadingStore from '@/store/loadingStore';
import './override.css';

export function Settings() {
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();
  const [activeTab, setActiveTab] = useState<string | null>('gallery');

  const { data: session } = useSession();
  const iconStyle = { width: rem(12), height: rem(12) };

  return <Flex direction="column" align="flex-start" gap={16} w="100%"></Flex>;
}
