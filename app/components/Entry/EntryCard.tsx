import { Box, Paper, Flex, Text } from '@mantine/core';
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import EntryFooter from './EntryFooter';
import EntriesService from '@/services/entryService/entryService';
import EntryHeader from './EntryHeader';
import parse, { domToReact } from 'html-react-parser';
import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser';

export function EntryCard({
  entry,
  session,
  index,
  singleEntry
}: {
  entry: any;
  index: number;
  session: Session;
  singleEntry: boolean;
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
    <Box p="xl" my="none">
      <Paper w={800} shadow="none" key={index}>
        <Flex direction="column" justify="flex-start" gap="sm">
          <Flex justify="space-between" gap="sm" pr="md">
            {entry.title && singleEntry? (
              <Link href={`/baslik/${entry.title.slug}`} style={{ color: "unset" }}>
                <Text component="h1" size="xl" fw="bold">
                  {entry.title.name}
                </Text>
              </Link>
            ) : (
              <Text size="xs" fw="lighter">
                {index + 1}
              </Text>
            )}
            <EntryHeader entryId={entry.id} />
          </Flex>
          <Box mb="md">
            {parse(entriesService.formatEntryContent(entry?.content), htmlParserOptions)}
          </Box>
          <EntryFooter entry={entry} />
        </Flex>
      </Paper>
    </Box>
  );
}

export default EntryCard;
