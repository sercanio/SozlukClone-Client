'use client';

import { useEffect, useState } from 'react';
import {
  Flex,
  Paper,
  Box,
  Select,
  Autocomplete,
  AutocompleteProps,
  Group,
  Avatar,
  Text,
  Table,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import formatDate from '@utils/FormatDate';
import AuthorGroupsService from '@services/authorGroupsService/authorGroupsService';
import AuthorsService from '@services/authorsService/authorsService';
import './override.css';

export function Users() {
  const [authorGroups, setAuthorGroups] = useState<{ id: number; name: string }[]>([]);
  const [group, setGroup] = useState<number | null>(null);
  const [usersData, setUsersData] = useState<
    Record<string, { id: number; image: string; email: string }>
  >({});
  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const [authorDetails, setAuthorDetails] = useState<any>(null);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const { data: session } = useSession();

  const authorService = new AuthorsService(session!);
  const authorGroupService = new AuthorGroupsService(session!);

  useEffect(() => {
    (async () => {
      await getAuthorGroups(0, 10);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (group) await fetchAuthorDetails(authorDetails?.id);
    })();
  }, [group]);

  async function getAuthorGroups(pageIndex: number, pageSize: number) {
    showSpinnerOverlay();
    try {
      const data = await authorGroupService.getAll(pageIndex, pageSize);
      setAuthorGroups(data.items);
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  async function searchAuthorByUserName(userName: string, pageIndex: number, pageSize: number) {
    if (userName.length > 1) {
      setAutocompleteError(null);
      showSpinnerOverlay();

      try {
        const data = await authorService.searchByUserName(userName, pageIndex, pageSize);
        const searchResults = data.items.reduce(
          (
            acc: Record<string, { id: number; image: string; email: string }>,
            item: { id: number; userName: string; profileImage: string; email: string }
          ) => {
            acc[item.userName] = { id: item.id, image: item.profileImage, email: item.email };
            return acc;
          },
          {}
        );
        setUsersData(searchResults);
      } catch (err: any) {
        showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
      } finally {
        hideSpinnerOverlay();
      }
    } else if (userName.length === 0) {
      setUsersData({});
      setAutocompleteError('Please type some characters');
    }
  }

  async function fetchAuthorDetails(authorId: number) {
    showSpinnerOverlay();
    try {
      const data = await authorService.getById(authorId);
      setAuthorDetails(data);
      hideSpinnerOverlay();
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
      hideSpinnerOverlay();
    }
  }

  async function handleAutocompleteSelect(value: string) {
    const selectedAuthor = usersData[value];
    if (selectedAuthor) {
      const selectedAuthorId = selectedAuthor.id;
      await fetchAuthorDetails(selectedAuthorId);
    }
  }

  function getGroupIdFromArray(name: string): number | undefined {
    const authorGroupId = authorGroups.find((grp) => grp.name === name)?.id;
    return authorGroupId;
  }

  function getAuthorGroupNameFromId(id: number) {
    const authorGroupName = authorGroups.find((grp) => grp.id === id)?.name;
    return authorGroupName;
  }

  function handleAuthorGroupChange(value: string) {
    showSpinnerOverlay();
    authorService
      .update({
        id: authorDetails.id,
        userId: authorDetails.userId,
        userName: authorDetails.userName,
        authorGroupId: getGroupIdFromArray(value)!,
        activeBadgeId: authorDetails.activeBadgeId,
        biography: null,
        profilePictureUrl: null,
        coverPictureUrl: null,
        age: null,
        gender: null,
      })
      .then(() => {
        showNotification({
          title: 'Başarılı',
          message: 'Kullanıcı rolü başarılı bir şekilde değiştirildi.',
          variant: 'success',
        });
        setGroup(getGroupIdFromArray(`${value}`) || null);
      })
      .catch((err) => {
        showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
      })
      .finally(() => {
        hideSpinnerOverlay();
      });
  }

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => (
    <Group gap="sm">
      <Avatar src={usersData[option.value]?.image} size={36} radius="xl" />
      <div>
        <Text size="sm">{option.value}</Text>
        <Text size="xs" opacity={0.5}>
          {usersData[option.value]?.email}
        </Text>
      </div>
    </Group>
  );

  return (
    <>
      <Paper withBorder p="xs">
        <Autocomplete
          data={Object.keys(usersData)}
          renderOption={renderAutocompleteOption}
          maxDropdownHeight={400}
          label="Yazar ara"
          placeholder="Kullanıcı adı girin"
          onChange={(value) => searchAuthorByUserName(value, 0, 10)}
          onOptionSubmit={(item) => handleAutocompleteSelect(item)}
          error={autocompleteError}
        />
      </Paper>
      {authorDetails && (
        <Flex justify="space-around" direction={{ base: 'column', md: 'row' }}>
          <Paper mt="lg">
            <Text size="xl" fw="bold" c="cyan" mb="xl" ml="xl">
              {authorDetails.userName}
            </Text>
            <Table
              highlightOnHover
              horizontalSpacing="xl"
              verticalSpacing="sm"
              withRowBorders={false}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <Text size="md">E-posta : </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="md">{authorDetails?.user?.email}</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <Text size="md">Kayıt: </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="md">{formatDate(authorDetails.createdDate)}</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <Text size="md">Rol: </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="md">{getAuthorGroupNameFromId(authorDetails.authorGroupId)}</Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Paper>
          <Box pos="relative">
            <Select
              label="Kullanıcı Rolleri"
              description="Buradan kullanıcı rolünü değiştirebilirsiniz."
              placeholder="Bir kullanıcı rolü seçin"
              onChange={(value) => handleAuthorGroupChange(value ?? '')}
              data={authorGroups.map((authorGroup) => authorGroup.name)}
              value={getAuthorGroupNameFromId(authorDetails.authorGroupId)}
              allowDeselect
              mt="md"
            />
          </Box>
        </Flex>
      )}
    </>
  );
}
