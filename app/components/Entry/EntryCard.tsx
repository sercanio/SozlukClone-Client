import { Box, Paper, Flex, Text } from '@mantine/core';
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import EntryFooter from './EntryFooter';
import EntriesService from '@/services/entryService/entryService';
import EntryHeader from './EntryHeader';
import parse, { domToReact } from 'html-react-parser';
import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser';

export function EntryCard({
  entry,
  session,
  index,
  title,
}: {
  entry: any;
  index: number;
  session: Session;
  title?: any;
}) {
  const entriesService = new EntriesService(session!);


  const htmlParserOptions: HTMLReactParserOptions = {
    replace(domNode: DOMNode) {
      // @ts-ignore
      if (!domNode?.attribs) {
        return;
      }
      // @ts-ignore
      if (domNode?.attribs.id === 'internallink') {
        // @ts-ignore
        return <Link href={domNode?.attribs.href}>{domToReact(domNode?.children)}</Link>;
      }
    },
  }

  return (
    <Box p="xl" my="xl">
      <Paper w={800} shadow="none" key={index}>
        <Flex direction="column" justify="flex-start" gap="sm">
          <Flex justify="space-between" gap="sm" pr="md">
            {entry.title ? (
              <Text component="h2" size="xl" mb="xl" >
                <Link href={`/baslik/${title.slug}`}>{title.name}</Link>
              </Text>
            ) : (
              <Text size="xs" fw="lighter">
                {index + 1}
              </Text>
            )}
            <EntryHeader entryId={entry.id} />
          </Flex>
          <Box>
            {parse(entriesService.formatEntryContent(entry.content), htmlParserOptions)}
          </Box>
          <Text id="entry" flex={1}></Text>
          <Flex justify="flex-end">
            <EntryFooter entry={entry} />
          </Flex>
        </Flex>
      </Paper>
    </Box>
  );
}

export default EntryCard;
