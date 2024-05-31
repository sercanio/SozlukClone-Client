'use client';

import { Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function BurgerMenu() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Burger
      opened={opened}
      onClick={toggle}
      aria-label="Toggle navigation"
      size="sm"
      hiddenFrom="sm"
    />
  );
}
