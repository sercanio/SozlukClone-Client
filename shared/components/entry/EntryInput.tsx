'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Flex, Group, Textarea } from '@mantine/core';
import styles from './EntryInput.module.css';
import TitlesService from '@/shared/services/titlesService/titlesService';
import { EntriesPostRequest } from '@/types/DTOs/EntriesDTOs';
import EntriesService from '@/shared/services/entryService/entryService';
import useNotificationStore from '@/store/notificationStore';
import useLoadingStore from '@/store/loadingStore';

export default function EntryInput({ titleId }: { titleId: number }) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const session = useSession();

  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const hasSelection = (start: number, end: number) => start !== end;

  const wrapText = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const before = text.substring(0, selectionStart);
    const after = text.substring(selectionEnd, text.length);
    const selectedText = text.substring(selectionStart, selectionEnd);

    const newText = before + prefix + selectedText + suffix + after;
    setText(newText);

    const newSelectionStart = selectionStart + prefix.length;
    const newSelectionEnd = selectionEnd + prefix.length;
    setTimeout(() => {
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      textarea.focus();
    }, 0);
  };

  const wrapSpoiler = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const before = text.substring(0, selectionStart);
    const after = text.substring(selectionEnd, text.length);
    const selectedText = text.substring(selectionStart, selectionEnd);

    const spoilerText = `--- \`spoiler\` ---\n\n${selectedText}\n--- \`spoiler\` --- `;
    const newText = before + spoilerText + after;
    setText(newText);

    const newSelectionStart = selectionStart + '--- `spoiler` ---\n\n'.length;
    const newSelectionEnd = newSelectionStart + selectedText.length;
    setTimeout(() => {
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      textarea.focus();
    }, 0);
  };

  const convertUrl = async () => {
    const textarea = textareaRef.current;
    if (!textarea || !window.prompt) return;

    const { selectionStart, selectionEnd } = textarea;

    if (!hasSelection(selectionStart, selectionEnd)) {
      // eslint-disable-next-line no-alert
      alert('Please select some text to convert to a URL.');
      return;
    }

    // eslint-disable-next-line no-alert
    const userUrl = window.prompt('Enter URL:', '');

    if (!userUrl) return;

    const before = text.substring(0, selectionStart);
    const after = text.substring(selectionEnd, text.length);
    const selectedText = text.substring(selectionStart, selectionEnd);

    // eslint-disable-next-line prefer-template
    const newText = before + `[${userUrl} ${selectedText}]` + after;

    setText(newText);

    const urlLength = `[${userUrl}](${userUrl})`.length;
    const newSelectionStart = selectionStart + urlLength;
    const newSelectionEnd = newSelectionStart + selectedText.length;
    setTimeout(() => {
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      textarea.focus();
    }, 0);
  };

  function EntryInputHeader() {
    return (
      <Flex gap="md" my="sm">
        <Button variant="outline" px="sm" py="none" onClick={() => wrapText('(bkz: ', ')')}>
          (bkz: )
        </Button>
        <Button variant="outline" px="sm" py="none" onClick={() => wrapText('(gbkz: ', ')')}>
          hede
        </Button>
        <Button variant="outline" px="sm" py="none" onClick={() => wrapText('`:', '`')}>
          *
        </Button>
        <Button variant="outline" px="sm" py="none" onClick={wrapSpoiler}>
          - spoiler -
        </Button>
        <Button variant="outline" px="sm" py="none" onClick={convertUrl}>
          http://
        </Button>
      </Flex>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    showSpinnerOverlay();
    const entriesService = new EntriesService(session.data!);
    try {
      const data: EntriesPostRequest = {
        content: text,
        titleId,
        authorId: session.data!.user.authorId,
      };
      await entriesService.create(data);
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }
  return (
    <form className={styles.entryInput} onSubmit={handleSubmit}>
      <Textarea
        ref={textareaRef}
        resize="both"
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
        label={<EntryInputHeader />}
        placeholder="başlık hakkında bilgi verin"
        rows={10}
      />
      <Group gap="sm" align="center" justify="flex-start" mt="md" px="xs">
        <Button type="submit" variant="transparent">
          kenarda dursun
        </Button>
        <Button type="submit">yolla</Button>
      </Group>
    </form>
  );
}
