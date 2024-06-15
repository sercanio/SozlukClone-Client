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
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import styles from './header.module.css';

export default function SearchButton(): JSX.Element {
  const router = useRouter();
  const session = useSession();
  const [titlesData, setTitlesData] = useState<
    Record<string, { id: number; name: string; slug: string; isLocked: boolean }>
  >({});
  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const form = useForm({
    initialValues: {
      search: '',
    },
  });

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => (
    <Group gap="sm">
      <div>
        <Link href={`/baslik/${titlesData[option.value]?.slug}--${titlesData[option.value]?.id}`}>
          {titlesData[option.value]?.name}
        </Link>
      </div>
    </Group>
  );

  async function searchTitles(title: string, pageIndex: number, pageSize: number) {
    if (title.length > 1) {
      form.setValues({ search: title });
      setAutocompleteError(null);
      const titlesService = new TitlesService(session.data!);
      try {
        const data = await titlesService.searchByTitle(title, pageIndex, pageSize);
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
    } else if (title.length === 0) {
      setTitlesData({});
      setAutocompleteError('Arama sırasında bir hata oluştu');
    }
  }

  function handleAutocompleteSelect(item: string) {
    const selectedTitle = titlesData[item];
    if (selectedTitle) {
      router.push(`/baslik/${selectedTitle.slug}`);
    }
  }

  function handleSubmit(values: typeof form.values) {
    const firstTitle = Object.values(titlesData)[0];
    if (firstTitle) {
      router.push(`/baslik/${firstTitle.slug}`);
    }
    router.push(`/?baslik=${values.search}`);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group justify="center" mt="sm">
        <Autocomplete
          data={Object.keys(titlesData)}
          renderOption={renderAutocompleteOption}
          maxDropdownHeight={400}
          placeholder="ara"
          onChange={(value) => searchTitles(value, 0, 10)}
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
