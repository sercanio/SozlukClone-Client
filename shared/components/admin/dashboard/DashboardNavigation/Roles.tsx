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
import AuthorGroupOperationClaimsService from '@/shared/services/authorGroupOperationClaimsService/authorGroupOperationClaimsService';
import OperationClaimsService from '@/shared/services/operationClaimsService/operationClaimsService';
import './override.css';

export function Roles() {
  const [authorGroups, setAuthorGroups] = useState<{ id: number; name: string }[]>([]);
  const [group, setGroup] = useState<number | null>(null);
  const [claims, setClaims] = useState<{ id: number; name: string }[]>([]);
  const [authorGroupClaims, setAuthorGroupClaims] = useState<
    { id: number; operationClaimId: number; authorGroupId: number }[]
  >([]);

  const showSpinnerOverlay = useLoadingStore((state) => state.showSpinnerOverlay);
  const hideSpinnerOverlay = useLoadingStore((state) => state.hideSpinnerOverlay);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { data: session } = useSession();

  async function getAuthorGroups(pageIndex: number, pageSize: number) {
    const authorGroupService = new AuthorGroupsService(session!);
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
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
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
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  async function addClaim(claimId: number) {
    const authorGroupOperationClaimsService = new AuthorGroupOperationClaimsService(session!);
    showSpinnerOverlay();
    try {
      const data = await authorGroupOperationClaimsService.addClaim(claimId, group!);
      setAuthorGroupClaims((prev) => [...prev, data]);
      showNotification({
        title: 'Başarılı',
        message: 'Kullanıcı gurubu izni başarılı bir şekilde eklendi.',
        variant: 'success',
      });
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  async function removeClaim(claimId: number) {
    const authorGroupOperationClaimsService = new AuthorGroupOperationClaimsService(session!);
    const claim = authorGroupClaims.find(
      (agc) => agc.operationClaimId === claimId && agc.authorGroupId === group
    );
    if (!claim) return;

    showSpinnerOverlay();
    try {
      await authorGroupOperationClaimsService.removeClaim(claim.id);
      setAuthorGroupClaims((prev) => prev.filter((agc) => agc.id !== claim.id));
      showNotification({
        title: 'Başarılı',
        message: 'Kullanıcı gurubu izni başarılı bir şekilde silindi.',
        variant: 'success',
      });
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  const handleCheckboxChange = (claimId: number, checked: boolean) => {
    if (checked) {
      addClaim(claimId);
    } else {
      removeClaim(claimId);
    }
  };

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
      <Text component="h1" size="xl" fw={700}>
        Kullanıcı Rol ve İzinleri
      </Text>
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
    </Container>
  );
}
