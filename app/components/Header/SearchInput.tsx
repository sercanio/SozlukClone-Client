'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Autocomplete, AutocompleteProps, Group, Button } from '@mantine/core';
import { useSession } from 'next-auth/react';
import TitlesService from '@services/titlesService/titlesService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import { TitleSearchResponse, TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import AuthorsService from '@/services/authorsService/authorsService';
import {
  AuthorsSearchByUserNameItem,
  AuthorsSearchByUserNameResponse,
} from '@/types/DTOs/AuthorsDTOs';

import styles from './header.module.css';

export default function SearchButton(): JSX.Element {
  const router = useRouter();
  const session = useSession();

  const [titlesData, setTitlesData] = useState<
    Record<string, { id: number; name: string; slug: string; isLocked: boolean }>
  >({});
  const [authorsData, setAuthorsData] = useState<
    Record<string, { id: number; userName: string; userNameDisplay: string; userId: string }>
  >({});

  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const form = useForm({
    initialValues: {
      search: '',
    },
  });

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => {
    const title = titlesData[option.value];
    const author = authorsData[option.value];
    return (
      <Group gap="sm">
        <div>
          {title ? (
            <Link href={`/baslik/${title.slug}`}>{title.name}</Link>
          ) : (
            <Link href={`/author/${author.userName}`}>{author.userNameDisplay}</Link>
          )}
        </div>
      </Group>
    );
  };

  async function searchTitles(title: string, pageIndex: number, pageSize: number) {
    if (title.length > 0) {
      form.setValues({ search: title });
      setAutocompleteError(null);
      const titlesService = new TitlesService(session.data!);
      try {
        const data: TitleSearchResponse = await titlesService.searchByTitle(
          title,
          pageIndex,
          pageSize
        );
        const searchResults = data.items.reduce(
          (
            acc: Record<string, { id: number; name: string; slug: string; isLocked: boolean }>,
            item: TitlesGetByIdResponse
          ) => {
            acc[item.name] = {
              id: item.id,
              name: item.name,
              slug: item.slug,
              isLocked: item.isLocked,
            };
            return acc;
          },
          {}
        );
        setTitlesData(searchResults);
      } catch (err: any) {
        showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
      }
    } else {
      setTitlesData({});
      setAutocompleteError('Arama sırasında bir hata oluştu');
    }
  }

  async function searchAuthors(authorUserName: string, pageIndex: number, pageSize: number) {
    if (authorUserName.length > 0) {
      form.setValues({ search: authorUserName });
      setAutocompleteError(null);
      const authorService = new AuthorsService(session.data!);
      try {
        const data: AuthorsSearchByUserNameResponse = await authorService.searchByUserName(
          authorUserName,
          pageIndex,
          pageSize
        );
        const searchResults = data.items.reduce(
          (
            acc: Record<
              string,
              { id: number; userName: string; userNameDisplay: string; userId: string }
            >,
            item: AuthorsSearchByUserNameItem
          ) => {
            acc[item.userName] = {
              id: item.id,
              userName: item.userName,
              userNameDisplay: `@${item.userName}`,
              userId: item.userId,
            };
            return acc;
          },
          {}
        );
        setAuthorsData(searchResults);
      } catch (err: any) {
        showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
      }
    } else {
      setAuthorsData({});
      setAutocompleteError('Arama sırasında bir hata oluştu');
    }
  }

  async function search(query: string, pageIndex: number, pageSize: number) {
    await searchAuthors(query, pageIndex, pageSize);
    await searchTitles(query, pageIndex, pageSize);
  }

  function handleAutocompleteSelect(item: string) {
    const selectedTitle = titlesData[item];
    const selectedAuthor = authorsData[item];
    if (selectedTitle) {
      router.push(`/baslik/${selectedTitle.slug}`);
    } else if (selectedAuthor) {
      router.push(`/biri/${selectedAuthor.userName}`);
    }
  }

  function handleSubmit(values: typeof form.values) {
    const firstTitle = Object.values(titlesData)[0];
    if (firstTitle) {
      router.push(`/baslik/${firstTitle.slug}`);
    } else {
      router.push(`/?baslik=${values.search}`);
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group justify="center" mt="sm">
        <Autocomplete
          data={[...Object.keys(titlesData), ...Object.keys(authorsData)]}
          renderOption={(props) => renderAutocompleteOption(props)}
          maxDropdownHeight={400}
          placeholder="ara"
          withAsterisk
          onChange={(value) => search(value, 0, 10)}
          onOptionSubmit={(item) => handleAutocompleteSelect(item)}
          comboboxProps={{ transitionProps: { transition: 'slide-down', duration: 100 } }}
          key={form.key('search')}
          error={autocompleteError}
        />
        <Group justify="center" mt="sm">
          <Button type="submit" variant="default">
            Search
          </Button>
        </Group>
      </Group>
    </form>
  );
}
