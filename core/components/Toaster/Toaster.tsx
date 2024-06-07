'use client';

import { Box, Notification, Stack, Transition } from '@mantine/core';
import useNotificationStore from '@/store/notificationStore';

export default function Toaster(): JSX.Element {
  const { notifications, hideNotification } = useNotificationStore();

  return (
    <Box
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 2000,
      }}
    >
      <Stack>
        {notifications.map((notification) => (
          <Transition key={notification.title} mounted transition="fade" duration={300}>
            {(styles) => (
              <Notification
                key={notification.title}
                style={styles}
                title={notification.title}
                onClose={() => hideNotification(notification.id)}
              >
                {notification.message}
              </Notification>
            )}
          </Transition>
        ))}
      </Stack>
    </Box>
  );
}
