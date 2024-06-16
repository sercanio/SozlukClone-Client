'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Box, List, ScrollArea, Text } from '@mantine/core';
import { Title } from '@/types/DTOs/TitlesDTOs';
import './override.css';

export function LeftFrame({ titles }: { titles: Title[] }) {
  return (
    <Box pos="fixed" top="109px" bottom={0} p="none">
      <Text component="h2" size="xl" mt="none" mb="lg">
        bugün
      </Text>
      <ScrollArea w={280} h={900} scrollbars="y" type="auto" scrollbarSize={10} offsetScrollbars>
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
    </Box>
  );
}

export default LeftFrame;
