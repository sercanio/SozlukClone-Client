'use client';

import { useEffect, useState } from 'react';
import {
  Checkbox,
  Container,
  Flex,
  List,
  Paper,
  ScrollArea,
  Box,
  Select,
  Text,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import AuthorGroupsService from '@/shared/services/authorGroupsService/authorGroupsService';
import useNotificationStore from '@/store/notificationStore';
import useLoadingStore from '@/store/loadingStore';
import './override.css';
import AuthorGroupOperationClaimsService from '@/shared/services/authorGroupOperationClaimsService/AuthorGroupOperationClaimsService';
import OperationClaimsService from '@/shared/services/operationClaimsService/operationClaimsService';

export function Roles() {
  const [authorGroups, setAuthorGroups] = useState<{ id: number; name: string }[]>([]);
  const [group, setGroup] = useState<number | null>(null);
  const [claims, setClaims] = useState<{ id: number; name: string }[]>([]);
  const [authorGroupClaims, setAuthorGroupClaims] = useState<
    { id: number; operationClaimId: number; authorGroupId: number }[]
  >([]);
  const [error, setError] = useState<null | { message: string }>(null);
  const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();
  const { showNotification } = useNotificationStore();
  const { data: session } = useSession();

  async function getAuthorGroups(pageIndex: number, pageSize: number) {
    const authorGroupService = new AuthorGroupsService(session!);
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

  async function getClaims(pageIndex: number, pageSize: number) {
    showSpinnerOverlay();
    const operationClaimsService = new OperationClaimsService(session!);
    try {
      const data = await operationClaimsService.getAll(pageIndex, pageSize);
      const clms = data.items.map((item: { id: number; name: string }) => ({
        id: item.id,
        name: item.name,
      }));
      setClaims(clms);
    } catch (err) {
      setError(err);
    } finally {
      hideSpinnerOverlay();
    }
  }

  async function getAuthorGroupClaims(pageIndex: number, pageSize: number) {
    const authorGroupOperationClaimsService = new AuthorGroupOperationClaimsService(session!);
    showSpinnerOverlay();
    try {
      const data = await authorGroupOperationClaimsService.getAll(pageIndex, pageSize);
      const clms = data.items.map(
        (item: { id: number; operationClaimId: number; authorGroupId: number }) => ({
          id: item.id,
          operationClaimId: item.operationClaimId,
          authorGroupId: item.authorGroupId,
        })
      );
      setAuthorGroupClaims(clms);
    } catch (err) {
      setError(err);
    } finally {
      hideSpinnerOverlay();
    }
  }

  function handleCheckboxChange(claimId: number, checked: boolean) {
    const claim = authorGroupClaims.find(
      (agc) => agc.operationClaimId === claimId && agc.authorGroupId === group
    );

    if (checked) {
      showSpinnerOverlay();
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
          hideSpinnerOverlay();
          showNotification('Başarılı', 'Kullanıcı gurubu izni başarılı bir şekilde eklendi.');
        })
        .catch((err) => {
          setError(err);
          hideSpinnerOverlay();
        });
    } else {
      showSpinnerOverlay();
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
          hideSpinnerOverlay();
          showNotification('Başarılı', 'Kullanıcı gurubu izni başarılı bir şekilde silindi.');
        })
        .catch((err) => {
          setError(err);
          showNotification(
            'Başarısız',
            'Kullanıcı gurubu izni başarılı bir şekilde değiştirilemedi.'
          );
          hideSpinnerOverlay();
        });
    }
  }

  const getGroupIdFromArray = (name: string) => {
    const authorGroupId = authorGroups.find((grp) => grp.name === name)?.id;
    return authorGroupId;
  };

  useEffect(() => {
    getAuthorGroups(0, 10);
    getClaims(0, 100);
  }, []);

  useEffect(() => {
    if (group !== null) {
      getAuthorGroupClaims(0, 100);
    }
  }, [group]);

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
      <Text size="md" mt="lg" c="red">
        {error && <p>{error.message}</p>}
      </Text>
    </Container>
  );
}
