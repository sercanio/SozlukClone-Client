'use client';

import { LoadingOverlay } from '@mantine/core';
import useLoadingStore from '@/store/loadingStore';

export default function LoadingSpinner() {
  const { visible } = useLoadingStore();

  return (
    <LoadingOverlay
      visible={visible}
      zIndex={1000}
      overlayProps={{ radius: 'none', blur: 0 }}
      transitionProps={{
        duration: 25,
        timingFunction: 'ease-in-out',
      }}
    />
  );
}
