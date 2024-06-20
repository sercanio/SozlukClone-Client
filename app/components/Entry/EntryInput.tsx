'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLeftFrameTrigger } from '@/store/triggerStore';
import { Box, Button, Flex, Group, Textarea } from '@mantine/core';
import EntriesService from '@services/entryService/entryService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import { EntriesGetByIdResponse, EntriesPostRequest, Entry, UpdateEntryByUserRequest } from '@/types/DTOs/EntriesDTOs';
import TitlesService from '@/services/titlesService/titlesService';
import { TitlesGetByIdResponse, TitlesPostRequest } from '@/types/DTOs/TitlesDTOs';
import styles from './EntryInput.module.css';

interface Props {
  titleId?: number;
  newTitle?: string | string[];
  entry?: EntriesGetByIdResponse;
}

export default function EntryInput({ titleId, newTitle, entry }: Props) {
  const router = useRouter();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const session = useSession();

  const setLeftFrameTrigger = useLeftFrameTrigger((state) => state.setTrigger);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const hasSelection = (start: number, end: number) => start !== end;

  useEffect(() => {
    setText(entry?.content || '')
  }, [])

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
      alert("metin kutusuna girdiğiniz URL'i seçin");
      return;
    }

    // eslint-disable-next-line no-alert
    const userUrl = window.prompt('URL girin', 'http://');

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

  const wrapImageLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    if (!hasSelection(selectionStart, selectionEnd)) {
      // eslint-disable-next-line no-alert
      alert("metin kutusuna girdiğiniz görsel linkini seçin.");
      return;
    }

    const before = text.substring(0, selectionStart);
    const after = text.substring(selectionEnd, text.length);
    const selectedText = text.substring(selectionStart, selectionEnd);

    const newText = before + `[img: ${selectedText}]` + after;
    setText(newText);

    const newSelectionStart = selectionStart + '[img: '.length;
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
        <Button variant="outline" px="sm" py="none" onClick={wrapImageLink}>
          görsel
        </Button>
      </Flex>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (entry?.id) {
      await updateExistingEntry(entry.id);
    } else {
      isItNewTitle() ? await createNewTitle() : await addNewEntry(titleId);
    }
  }

  function isItNewTitle() {
    return !!newTitle;
  }

  async function createNewTitle() {
    showSpinnerOverlay();
    const titlesService = new TitlesService(session.data!);
    try {
      const data: TitlesPostRequest = {
        name: newTitle as string,
        authorId: session.data!.user.authorId,
      };
      const response = await titlesService.create<TitlesGetByIdResponse, TitlesPostRequest>(data);
      await addNewEntry(response.id);
      return response.id;
    } catch (err: any) {
      showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
      return null;
    } finally {
      hideSpinnerOverlay();
    }
  }

  async function addNewEntry(id: number | undefined) {
    showSpinnerOverlay();
    const entriesService = new EntriesService(session.data!);
    try {
      const data: EntriesPostRequest = {
        content: text,
        titleId: id as number,
        authorId: session.data!.user.authorId,
      };
      const createdEntry: EntriesGetByIdResponse = await entriesService.create(data);
      router.push(`/tanim/${createdEntry?.id}`);
      router.refresh();
      showNotification({ title: 'başarılı', message: "tanım eklendi", variant: 'success' });
      setLeftFrameTrigger();
    } catch (err: any) {
      showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  async function updateExistingEntry(entryId: number) {
    showSpinnerOverlay();
    const entriesService = new EntriesService(session.data!);
    try {
      const data: UpdateEntryByUserRequest = {
        id: entryId,
        content: text,
        titleId: entry?.titleId as number,
      };
      await entriesService.update(data);
      router.push(`/tanim/${entry?.id}`);
      router.refresh();
      showNotification({ title: 'başarılı', message: 'tanım güncellendi.', variant: 'success' });
    } catch (err: any) {
      showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
      console.log(err);

    } finally {
      hideSpinnerOverlay();
    }
  }

  return (
    <Box px="lg">
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
    </Box>
  );
}
