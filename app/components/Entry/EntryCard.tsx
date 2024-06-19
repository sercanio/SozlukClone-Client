import { Box, Paper, Flex, Text } from '@mantine/core';
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import EntryFooter from './EntryFooter';
import EntriesService from '@/services/entryService/entryService';
import EntryHeader from './EntryHeader';
import DOMPurify from 'dompurify';
// import HTMLReactParser from 'html-react-parser';
import parse, { domToReact } from 'html-react-parser';

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

  return (
    <Box p="xl" my="xl">
      <Paper w={800} shadow="none" key={index}>
        <Flex direction="column" justify="flex-start" gap="sm">
          <Flex justify="space-between" gap="sm" pr="md">
            {entry.title ? (
              <Text component="h2" size="xl" mb="xl" fw={700}>
                <Link href={`/baslik/${title.slug}`}>{title.name}</Link>
              </Text>
            ) : (
              <Text size="xs" fw="lighter">
                {index + 1}
              </Text>
            )}
            <EntryHeader entryId={entry.id} />
          </Flex>
          {/* <Box
            flex={1}
            dangerouslySetInnerHTML={{
              __html: entriesService.formatEntryContent(entry.content),
            }}
          /> */}
          <Box>
            {parse(entriesService.formatEntryContent(entry.content), {
              replace({ attribs, children }) {
                if (!attribs) {
                  return;
                }
                if (attribs.id === 'internallink') {
                  return <Link href={attribs.href}>{domToReact(children)}</Link>;
                }

              },
            })}
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
