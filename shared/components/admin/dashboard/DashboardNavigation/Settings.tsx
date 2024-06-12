'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FileInput,
  Flex,
  Group,
  NumberInput,
  Paper,
  Select,
  TextInput,
  Textarea,
  rem,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useForm } from '@mantine/form';
import { IconBadgeTm, IconFavicon } from '@tabler/icons-react';
import useNotificationStore from '@/store/notificationStore';
import useLoadingStore from '@/store/loadingStore';
import { GlobalSettingsGetByIdResponse } from '@/types/DTOs/GlobalSettingsDTOs';
import GlobalSettingsService from '@/shared/services/globalSettingsService/globalSettingsService';
import AuthorGroupsService from '@/shared/services/authorGroupsService/authorGroupsService';
import './override.css';
import { AuthorGroup } from '@/types/DTOs/AuthorGroupsDTOs';

export function Settings() {
  const { data: session } = useSession();
  const globalSettingsService = new GlobalSettingsService(session!);
  const authorGroupsService = new AuthorGroupsService(session!);

  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const [authorGroups, setAuthorGroups] = useState<AuthorGroup[]>([]);

  const [globalSettings, setGlobalSettings] = useState<GlobalSettingsGetByIdResponse>();

  const form = useForm({
    initialValues: {
      siteName: '',
      siteDescription: '',
      siteFavIcon: '',
      siteLogo: '',
      siteLogoFooter: '',
      siteLogoMobile: '',
      maxTitleLength: '',
      defaultAuthorGroupId: '',
      IsAuthorRegistrationAllowed: false,
      maxEntryLength: '',
    },
    validate: {
      siteName: (value) => (value ? null : 'Site Name is required'),
      siteDescription: (value) => (value ? null : 'Site Description is required'),
      siteFavIcon: (value: File | null) =>
        value && value.name && !value.name.endsWith('.ico')
          ? 'Favicon should be a .ico file'
          : null,
      siteLogo: (value: File | null) =>
        value && value.name && !value.name.endsWith('.png') ? 'Logo should be a .png file' : null,
    },
  });

  useEffect(() => {
    (async () => {
      const settings: GlobalSettingsGetByIdResponse | null = await fetchGlobalSettings();
      if (settings) {
        setGlobalSettings(settings);
        form.setValues({
          siteName: settings.siteName,
          siteDescription: settings.siteDescription,
          siteFavIcon: settings.siteFavIcon!,
          siteLogo: settings.siteLogo!,
          siteLogoFooter: settings.siteLogoFooter!,
          siteLogoMobile: settings.siteLogoMobile!,
          maxTitleLength: settings.maxTitleLength!.toString(),
          defaultAuthorGroupId: settings.defaultAuthorGroupId!.toString(),
          IsAuthorRegistrationAllowed: settings.isAuthorRegistrationAllowed,
          maxEntryLength: settings.maxEntryLength!.toString(),
        });
      }
      const agrps = await authorGroupsService.getAll(0, 20);
      if (agrps.items && agrps.items.length > 0) {
        setAuthorGroups(agrps.items);
      }
    })();
  }, []);

  async function fetchGlobalSettings(): Promise<GlobalSettingsGetByIdResponse | null> {
    showSpinnerOverlay();
    try {
      const data = await globalSettingsService.getAll(0, 10);
      return data.items[0];
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
    return null;
  }

  const handleSubmit = async (values: typeof form.values) => {
    showSpinnerOverlay();
    try {
      const formData = new FormData();
      formData.append('id', String(globalSettings!.id));
      formData.append('siteName', values.siteName);
      formData.append('siteDescription', values.siteDescription);
      formData.append('defaultAuthorGroupId', values.defaultAuthorGroupId);
      formData.append('siteFavIcon', values.siteFavIcon);
      formData.append('siteLogo', values.siteLogo);
      formData.append('siteLogoFooter', values.siteLogo);
      formData.append('isAuthorRegistrationAllowed', String(values.IsAuthorRegistrationAllowed));
      formData.append('maxTitleLength', values.maxTitleLength);
      formData.append('maxEntryLength', values.maxEntryLength);

      await globalSettingsService.update(formData);

      showNotification({
        title: 'Başarılı',
        message: 'Settings updated successfully',
        variant: 'success',
      });
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  };

  return (
    <Flex direction="column" align="flex-start" gap={16} w="100%">
      <Paper mt="lg" mx="auto" w="100%">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction="column">
            <Flex direction="column" gap="xl">
              <TextInput
                label="Site Name"
                placeholder="Site Name"
                key="siteName"
                {...form.getInputProps('siteName')}
              />
              <Textarea
                label="Site Description"
                placeholder="Site Description"
                key="siteDescription"
                {...form.getInputProps('siteDescription')}
                autosize
                minRows={4}
                maxRows={12}
              />
              <Flex gap="md">
                <FileInput
                  flex={1}
                  leftSection={
                    <IconFavicon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                  }
                  label="Favicon Değiştir"
                  placeholder="Favicon"
                  leftSectionPointerEvents="none"
                  key={form.key('siteFavIcon')}
                  {...form.getInputProps('siteFavIcon')}
                />
                <FileInput
                  flex={1}
                  leftSection={
                    <IconBadgeTm style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                  }
                  label="Logo Değiştir"
                  placeholder="Logo"
                  leftSectionPointerEvents="none"
                  key={form.key('siteLogo')}
                  {...form.getInputProps('siteLogo')}
                />
              </Flex>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap="md"
                align={{ base: 'flex-start', md: 'center' }}
              >
                <Select
                  label="Yeni kullanıcı varsayılan yazar grubu"
                  data={authorGroups.map((group) => ({
                    label: group.name.toString(),
                    value: group.id.toString(),
                  }))}
                  key={form.key('defaultAuthorGroupId')}
                  {...form.getInputProps('defaultAuthorGroupId')}
                  w={{ base: '100%', xs: '50%' }}
                />
                <Checkbox
                  mt={{ base: 'sm', md: 'lg' }}
                  label="Yazar kaydına izin ver"
                  key={form.key('IsAuthorRegistrationAllowed')}
                  {...form.getInputProps('IsAuthorRegistrationAllowed', { type: 'checkbox' })}
                />
              </Flex>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap="md"
                align={{ base: 'flex-start', md: 'center' }}
              >
                <NumberInput
                  flex={1}
                  label="Maksimum başlık uzunluğu (karakter)"
                  placeholder="Negatif sayı girmeyin"
                  min={0}
                  key={form.key('maxTitleLength')}
                  {...form.getInputProps('maxTitleLength')}
                  w={{ base: '100%', xs: '50%' }}
                />
                <NumberInput
                  flex={1}
                  label="Maksimum tanım uzunluğu (karakter)"
                  placeholder="Negatif sayı girmeyin"
                  min={0}
                  key={form.key('maxEntryLength')}
                  {...form.getInputProps('maxEntryLength')}
                  w={{ base: '100%', xs: '50%' }}
                />
              </Flex>
            </Flex>
          </Flex>
          <Group justify="center" mt="xl">
            <Button type="submit" disabled={!form.isValid() || !form.isTouched()}>
              Kaydet
            </Button>
            <Button
              variant="light"
              onClick={() =>
                form.setValues({
                  siteName: globalSettings?.siteName || '',
                  siteDescription: globalSettings?.siteDescription || '',
                  siteFavIcon: '',
                  siteLogo: '',
                })
              }
            >
              Resetle
            </Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
}
