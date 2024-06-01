'use client';

import { useEffect, useState } from 'react';
import {
  Checkbox,
  Container,
  Flex,
  List,
  Paper,
  ScrollArea,
  LoadingOverlay,
  Box,
  Notification,
  Select,
  Transition,
  Stack,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useDisclosure } from '@mantine/hooks';
import useNotificationStore from '@/store/notificationStore';
import './override.css';

export function Roles() {
  const [authorGroups, setAuthorGroups] = useState<{ id: number; name: string }[]>([]);
  const [group, setGroup] = useState<number | null>(null);
  const [claims, setClaims] = useState<{ id: number; name: string }[]>([]);
  const [authorGroupClaims, setAuthorGroupClaims] = useState<
    { id: number; operationClaimId: number; authorGroupId: number }[]
  >([]);
  const [error, setError] = useState<null | { message: string }>(null);
  const [visible, { open, close }] = useDisclosure(false);

  const { notifications, showNotification, hideNotification } = useNotificationStore();
  const { data: session } = useSession();

  useEffect(() => {
    getAuthorGroups(0, 10);
    getClaims(0, 100);
  }, []);

  useEffect(() => {
    if (group !== null) {
      getAuthorGroupClaims(0, 100);
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

  function getClaims(pageIndex: number, pageSize: number) {
    open();
    fetch(
      `http://localhost:60805/api/OperationClaims?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const clms = data.items.map(
          (item: { id: number; name: string }) =>
            ({ id: item.id, name: item.name }) as { id: number; name: string }
        );
        setClaims(clms);
        close();
      })
      .catch((err) => {
        setError(err);
        close();
      });
  }

  function getAuthorGroupClaims(pageIndex: number, pageSize: number) {
    open();
    fetch(
      `http://localhost:60805/api/AuthorGroupUserOperationClaims?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const clms = data.items.map(
          (item: { id: number; operationClaimId: number; authorGroupId: number }) =>
            ({
              id: item.id,
              operationClaimId: item.operationClaimId,
              authorGroupId: item.authorGroupId,
            }) as { id: number; operationClaimId: number; authorGroupId: number }
        );
        setAuthorGroupClaims(clms);
        close();
      })
      .catch((err) => {
        setError(err);
        close();
      });
  }

  function handleCheckboxChange(claimId: number, checked: boolean) {
    const claim = authorGroupClaims.find(
      (agc) => agc.operationClaimId === claimId && agc.authorGroupId === group
    );

    if (checked) {
      open();
      fetch('http://localhost:60805/api/AuthorGroupUserOperationClaims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          operationClaimId: claimId,
          authorGroupId: group,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAuthorGroupClaims((prev) => [...prev, data]);
          close();
          showNotification('Başarılı', 'Kullanıcı gurubu izni başarılı bir şekilde eklendi.');
        })
        .catch((err) => {
          setError(err);
          close();
        });
    } else {
      open();
      fetch(`http://localhost:60805/api/AuthorGroupUserOperationClaims/${claim?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        credentials: 'include',
      })
        .then(() => {
          setAuthorGroupClaims((prev) => prev.filter((agc) => agc.id !== claim?.id));
          close();
          showNotification('Başarılı', 'Kullanıcı gurubu izni başarılı bir şekilde silindi.');
        })
        .catch((err) => {
          setError(err);
          close();
        });
    }
  }

  const getGroupIdFromArray = (name: string) => {
    const authorGroupId = authorGroups.find((grp) => grp.name === name)?.id;
    return authorGroupId;
  };

  return (
    <Container py="none" px="sm">
      <h1>Kullanıcı Rol ve İzinleri</h1>
      <Flex direction="column" gap="lg">
        <Select
          label="Kullanıcı Rolleri"
          description="Buradan izinlerini değiştirmek istediğiniz kullanıcı rolünü seçebilirsiniz."
          placeholder="Bir kullanıcı rolü seçin"
          onChange={(value) => setGroup(getGroupIdFromArray(`${value}`) || null)}
          data={authorGroups.map((authorGroup) => authorGroup.name)}
          defaultValue={authorGroups[0]?.name}
          allowDeselect
          mt="md"
        />
        <Box pos="relative">
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          <Paper withBorder p="xs">
            <ScrollArea h={450}>
              <List>
                {claims.map((claim) => (
                  <List.Item key={claim.id}>
                    <Checkbox
                      color="cyan.6"
                      iconColor="dark.8"
                      size="md"
                      checked={authorGroupClaims.some(
                        (agc) => agc.operationClaimId === claim.id && agc.authorGroupId === group
                      )}
                      onChange={(event) =>
                        handleCheckboxChange(claim.id, event.currentTarget.checked)
                      }
                      label={claim.name}
                    />
                  </List.Item>
                ))}
              </List>
            </ScrollArea>
          </Paper>
        </Box>
      </Flex>
      {error && <p>{error.message}</p>}
      <Box
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 2000,
        }}
      >
        <Stack spacing="sm">
          {notifications.map((notification) => (
            <Transition key={notification.id} mounted={true} transition="fade" duration={300}>
              {(styles) => (
                <Notification
                  style={styles}
                  title={notification.title}
                  onClose={() => hideNotification(notification.id)}
                >
                  {notification.message}
                </Notification>
              )}
            </Transition>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
