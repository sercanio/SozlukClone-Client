'use client';

import React from 'react';
import Link from 'next/link';
import { Button, List, ScrollArea, Text } from '@mantine/core';
import { Title } from '@/types/DTOs/TitlesDTOs';
import './override.css';

export function LeftFrame({ titles }: { titles: Title[] }) {
  return (
    <ScrollArea w={325} h={900} p="sm">
      <Text component="h2" size="xl" mt="none" mb="lg">
        bugün
      </Text>
      <List spacing="sm">
        {titles.map((title: Title) => (
          <List.Item key={title.slug}>
            <Button
              rightSection={title?.entryCount}
              component={Link}
              href={`/baslik/${title.slug}`}
              variant="transparent"
              fullWidth
              justify="between"
              pl="none"
            >
              {title.name}
            </Button>
          </List.Item>
        ))}
      </List>
    </ScrollArea>
  );
}

export default LeftFrame;
