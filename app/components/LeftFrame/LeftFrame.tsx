'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button, Box, List, ScrollArea, Text, LoadingOverlay, Pagination, Flex } from '@mantine/core';
import { Title, TitlesGetAllResponse } from '@/types/DTOs/TitlesDTOs';
import TitlesService from '@/services/titlesService/titlesService';
import './override.css';

export function LeftFrame() {
  const session = useSession();
  const titleService = new TitlesService(session.data!);
  const [titles, setTitles] = useState<TitlesGetAllResponse>();
  const [page, setPage] = useState<number>(0)
  const [isComponentLoading, setIsComponentLoading] = useState<boolean>(true);

  useEffect(() => {
    // (async () => {
    getLatestTitles(page, 20)
    // }
    // )()
  }, [page])

  async function getLatestTitles(pageIndex: number, pageSize: number) {
    setIsComponentLoading(true);
    const response: TitlesGetAllResponse = await titleService.getAll(pageIndex, pageSize);
    setTitles({ ...response })
    setIsComponentLoading(false);
  }

  console.log(page);


  return (
    <Box p="none" h="100%" >
      <ScrollArea pos="fixed" top="109px" bottom={0} w={300} scrollbars="y" type="auto" scrollbarSize={10} offsetScrollbars style={{ height: "calc(100% - 130px)" }} >
        <Text component="h2" size="xl" mb="lg">
          son başlıklar
        </Text >
        {isComponentLoading && <Box mt="xl">
          <LoadingOverlay
            top="7rem"
            visible={isComponentLoading}
            zIndex={1000}
            style={{ alignItems: "flex-start" }}
            overlayProps={{ radius: 'none', backgroundOpacity: 0 }}
            loaderProps={{ color: 'cyan.6', type: 'bars' }}
            transitionProps={{
              duration: 25,
              timingFunction: 'ease-in-out',
            }}
          />
          <Text component="p" size="md" mt="none" mb="xl" ta="center">
            başlıklar getiriliyor...
          </Text>
        </Box>}
        <Flex direction="column" gap="xl" align="center">
          {(!isComponentLoading && page !== 0) && <Pagination size="sm" total={titles?.pages as number} withControls={false} value={page + 1} onChange={(page) => setPage(page - 1)} />}
          <List spacing="xs">
            {titles?.items.map((title: Title) => (
              <List.Item key={title.slug}>
                <Button
                  rightSection={title?.entryCount}
                  component={Link}
                  href={`/baslik/${title.slug}`}
                  variant="transparent"
                  justify="between"
                  pl="none"
                  w={292}
                >
                  {title.name}
                </Button>
              </List.Item>
            ))}
          </List>
          {(!isComponentLoading && page === 0) && <Button variant="transparent" onClick={() => setPage(1)}>daha fazla başlık getir...</Button>}
          {(!isComponentLoading && page !== 0) && <Pagination size="sm" total={titles?.pages as number} withControls={false} value={page + 1} onChange={(page) => setPage(page - 1)} />}
        </Flex>
      </ScrollArea>
    </Box >
  );
}

export default LeftFrame;
