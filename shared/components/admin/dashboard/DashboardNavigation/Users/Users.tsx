'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Flex,
  Paper,
  LoadingOverlay,
  Box,
  Notification,
  Select,
  Transition,
  Stack,
  Autocomplete,
  AutocompleteProps,
  Group,
  Avatar,
  Text,
  Grid,
  Table,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useDisclosure } from '@mantine/hooks';
import useNotificationStore from '@/store/notificationStore';
import formatDate from '@/utils/FormatDate';
import styles from './Users.module.css';
import '../override.css';
import updateAuthorById from '@/shared/services/author/authorService';

export function Users() {
  const [authorGroups, setAuthorGroups] = useState<{ id: number; name: string }[]>([]);
  const [group, setGroup] = useState<number | null>(null);
  const [usersData, setUsersData] = useState<
    Record<string, { id: number; image: string; email: string }>
  >({});
  const [error, setError] = useState<null | { message: string }>(null);
  const [visible, { open, close }] = useDisclosure(false);
  const [autocompleteError, setAutocompleteError] = useState<string | null>(null);
  const [authorDetails, setAuthorDetails] = useState<any>(null);

  const { showNotification } = useNotificationStore();
  const { data: session } = useSession();

  useEffect(() => {
    getAuthorGroups(0, 10);
  }, []);

  useEffect(() => {
    if (authorDetails) {
      fetchAuthorDetails(authorDetails?.id);
    }
  }, [group]);

  function getAuthorGroups(pageIndex: number, pageSize: number) {
    open();
    fetch(`http://localhost:60805/api/AuthorGroups?PageIndex=${pageIndex}&PageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        const authorGrps = data.items.map(
          (item: { id: number; name: string }) =>
            ({ id: item.id, name: item.name }) as { id: number; name: string }
        );
        setAuthorGroups(authorGrps);
        close();
      })
      .catch((err) => {
        setError(err);
        close();
      });
  }

  function searchAuthorByUserName(userName: string) {
    if (userName.length > 1) {
      setAutocompleteError(null);
      open();
      fetch('http://localhost:60805/api/Authors/Dynamic?PageIndex=0&PageSize=10', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          sort: [
            {
              field: 'userName',
              dir: 'asc',
            },
          ],
          filter: {
            field: 'userName',
            operator: 'contains',
            value: userName,
          },
        }),
      })
        .then((response) => response.json())
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
          close();
        })
        .catch((err) => {
          setError(err);
          showNotification('Başarısız oldu', 'error');
          close();
        });
    } else if (userName.length === 0) {
      setUsersData({});
      setAutocompleteError('Please type some characters');
    }
  }

  function fetchAuthorDetails(authorId: number) {
    open();
    fetch(`http://localhost:60805/api/Authors/${authorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setAuthorDetails(data);
        close();
      })
      .catch((err) => {
        setError(err);
        close();
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
    updateAuthorById(
      {
        id: authorDetails.id,
        userId: authorDetails.userId,
        userName: authorDetails.userName,
        authorGroupId: getGroupIdFromArray(value),
        activeBadgeId: authorDetails.activeBadgeId,
      },
      session
    )
      .then(() => {
        showNotification('Başarılı', 'Kullanıcı rolü başarılı bir şekilde değiştirildi.');
        setGroup(getGroupIdFromArray(`${value}`) || null);
      })
      .catch((err) => {
        setError(err);
        showNotification('Başarısız', 'Kullanıcı rolü değiştirilemedi.');
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
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: 'none', blur: 0 }}
          transitionProps={{
            duration: 25,
            timingFunction: 'ease-in-out',
          }}
        />
        <Autocomplete
          data={Object.keys(usersData)}
          renderOption={renderAutocompleteOption}
          maxDropdownHeight={400}
          label="Yazar ara"
          placeholder="Kullanıcı adı girin"
          onChange={(value) => searchAuthorByUserName(value)}
          onOptionSubmit={(item) => handleAutocompleteSelect(item)}
          error={autocompleteError}
        />
      </Paper>
      {authorDetails && (
        <Flex justify="space-around" direction={{ base: 'column', md: 'row' }}>
          <Paper mt="lg">
            {/* <h2>Yazar Bilgileri</h2> */}
            <Text size="xl" fw="bold" c="cyan" mb="xl" ml="xl">
              {authorDetails.userName}
            </Text>
            {/* <Text size="md">Kayıt: {formatDate(authorDetails.createdDate)}</Text>
            <Text size="md">E-posta: {authorDetails?.user?.email}</Text> */}
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
      {error && <p>{error.message}</p>}
    </Container>
  );
}
