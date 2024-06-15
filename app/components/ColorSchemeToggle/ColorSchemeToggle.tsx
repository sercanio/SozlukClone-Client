'use client';

import { Button, Group, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  return (
    <Group justify="center" mt="xl">
      <Button onClick={() => toggleColorScheme()}>{colorScheme}</Button>
    </Group>
  );
}
