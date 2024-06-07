'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Flex,
  Paper,
  LoadingOverlay,
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
import useNotificationStore from '@/store/notificationStore';
import useLoadingStore from '@/store/loadingStore';
import formatDate from '@/utils/FormatDate';
import AuthorGroupsService from '@/shared/services/authorGroupsService/authorGroupsService';
import AuthorsService from '@/shared/services/authorsService/authorsService';
import styles from './Users.module.css';
import './override.css';

export function Users() {
  const [authorGroups, setAuthorGroups] = useState<{ id: number; name: string }[]>([]);
  const [group, setGroup] = useState<number | null>(null);
  const [usersData, setUsersData] = useState<
    Record<string, { id: number; image: string; email: string }>
  >({});
  const [error, setError] = useState<null | { message: string }>(null);
  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const [authorDetails, setAuthorDetails] = useState<any>(null);
  const { showNotification } = useNotificationStore();
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

  const { data: session } = useSession();

  const authorService = new AuthorsService(session!);
  const authorGroupService = new AuthorGroupsService(session!);

  useEffect(() => {
    getAuthorGroups(0, 10);
  }, []);

  useEffect(() => {
    if (authorDetails) {
      fetchAuthorDetails(authorDetails?.id);
    }
  }, [group]);

  async function getAuthorGroups(pageIndex: number, pageSize: number) {
    showSpinnerOverlay();
    try {
      const data = await authorGroupService.getAll(pageIndex, pageSize);
      setAuthorGroups(data.items);
    } catch (err) {
      setError(err);
    } finally {
      hideSpinnerOverlay();
    }
  }

  function searchAuthorByUserName(userName: string, pageIndex: number, pageSize: number) {
    if (userName.length > 1) {
      setAutocompleteError(null);
      showSpinnerOverlay();
      authorService
        .searchByUserName(userName, pageIndex, pageSize)
        .then((data) => {
          const searchResults = data.items.reduce(
            (
              acc: Record<string, { id: number; image: string }>,
              item: { id: number; userName: string; profileImage: string }
            ) => {
              acc[item.userName] = {
                id: item.id,
                image: item.profileImage,
              };
              return acc;
            },
            {}
          );
          setUsersData(searchResults);
          hideSpinnerOverlay();
        })
        .catch((err) => {
          setError(err);
          showNotification('Başarısız oldu', 'error');
          hideSpinnerOverlay();
        });
    } else if (userName.length === 0) {
      setUsersData({});
      setAutocompleteError('Please type some characters');
    }
  }

  function fetchAuthorDetails(authorId: number) {
    showSpinnerOverlay();
    authorService
      .getById(authorId)
      .then((data) => {
        setAuthorDetails(data);
        showNotification('Başarılı', 'Kullanıcı bilgileri getirildi.');
        hideSpinnerOverlay();
      })
      .catch((err) => {
        setError(err);
        showNotification('Başarısız', 'Kullanıcı bilgileri getirilemedi.');
        hideSpinnerOverlay();
      });
  }

  function handleAutocompleteSelect(value: string) {
    const selectedAuthor = usersData[value];
    if (selectedAuthor) {
      const selectedAuthorId = selectedAuthor.id;
      fetchAuthorDetails(selectedAuthorId);
    }
  }

  function getGroupIdFromArray(name: string) {
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
        authorGroupId: getGroupIdFromArray(value),
        activeBadgeId: authorDetails.activeBadgeId,
      })
      .then(() => {
        showNotification('Başarılı', 'Kullanıcı rolü başarılı bir şekilde değiştirildi.');
        setGroup(getGroupIdFromArray(`${value}`) || null);
      })
      .catch((err) => {
        showNotification('Başarısız', 'Kullanıcı rolü değiştirilemedi.');
        setError(err);
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
    <Container py="none" px="sm" w="100%">
      <h1>Kullanıcılar</h1>
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
                <Table.Tr key="asdasdsadasd123">
                  <Table.Td>
                    <Text size="md">E-posta : </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="md">{authorDetails?.user?.email}</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr key="asdasdsadasd">
                  <Table.Td>
                    <Text size="md">Kayıt: </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="md">{formatDate(authorDetails.createdDate)}</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr key="asdasdsadasd11">
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
      <Text size="md" mt="lg" c="red">
        {error && <p>{error.message}</p>}
      </Text>
    </Container>
  );
}
