'use client';

import { useEffect, useState } from 'react';
import {
  Checkbox,
  Flex,
  List,
  Paper,
  ScrollArea,
  Box,
  Select,
  Text,
  ColorPicker,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import AuthorGroupsService from '@services/authorGroupsService/authorGroupsService';
import useNotificationStore from '@store/notificationStore';
import useLoadingStore from '@store/loadingStore';
import AuthorGroupOperationClaimsService from '@services/authorGroupOperationClaimsService/authorGroupOperationClaimsService';
import OperationClaimsService from '@services/operationClaimsService/operationClaimsService';
import { AuthorGroup } from '@/types/DTOs/AuthorGroupsDTOs';
import { OperatinClaimsGetByIdResponse } from '@/types/DTOs/OperationClaimsDTOs';
import {
  AuthorGroupOperationClaim,
  AuthorGroupOperationClaimsGetAllResponse,
  } from '@/types/DTOs/AuthorGroupOperationClaimsDTOs';
import './override.css';

export function Roles() {
  const [authorGroups, setAuthorGroups] = useState<AuthorGroup[]>([]);
  const [group, setGroup] = useState<number | null>(null);
  const [claims, setClaims] = useState<OperatinClaimsGetByIdResponse[]>([]);
  const [authorGroupClaims, setAuthorGroupClaims] = useState<AuthorGroupOperationClaim[]>([]);

  const showSpinnerOverlay = useLoadingStore((state) => state.showSpinnerOverlay);
  const hideSpinnerOverlay = useLoadingStore((state) => state.hideSpinnerOverlay);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const { data: session } = useSession();

  async function getAuthorGroups(pageIndex: number, pageSize: number) {
    const authorGroupService = new AuthorGroupsService(session!);
    showSpinnerOverlay();
    try {
      const data = await authorGroupService.getAll(pageIndex, pageSize);
      data.items.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
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
      const clms = data.items.map((item: OperatinClaimsGetByIdResponse) => item);
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
      const data: AuthorGroupOperationClaimsGetAllResponse =
        await authorGroupOperationClaimsService.getAll(pageIndex, pageSize);
      const clms: AuthorGroupOperationClaim[] = data.items;
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

  function handleCheckboxChange(claimId: number, checked: boolean) {
    if (checked) {
      addClaim(claimId);
    } else {
      removeClaim(claimId);
    }
  }

  async function handleColorPickerChange(color: string) {
    if (group === null) return;
    const authorGroupService = new AuthorGroupsService(session!);
    showSpinnerOverlay();
    try {
      const authorGroupToUpdate = authorGroups.find((grp) => grp.id === group);
      if (!authorGroupToUpdate) return;
      await authorGroupService.update(group, { ...authorGroupToUpdate, color });
      showNotification({
        title: 'Başarılı',
        message: 'Kullanıcı gurubu rengi başarılı bir şekilde güncellendi.',
        variant: 'success',
      });
      setAuthorGroups((prev) =>
        prev.map((grp) => {
          if (grp.id === group) {
            return { ...grp, color };
          }
          return grp;
        })
      );
    } catch (err: any) {
      showNotification({ title: 'Başarısız', message: err.message, variant: 'error' });
    } finally {
      hideSpinnerOverlay();
    }
  }

  const getGroupIdFromArray = (name: string) => {
    const authorGroupId = authorGroups.find((grp) => grp.name === name)?.id;
    return authorGroupId;
  };

  useEffect(() => {
    getAuthorGroups(0, 10);
    getClaims(0, 1000);
  }, []);

  useEffect(() => {
    if (group !== null) {
      getAuthorGroupClaims(0, 1000);
    }
  }, [group]);

  return (
    <Flex direction="column" gap="lg" w="100%">
      <Select
        label="Kullanıcı Rolleri"
        description="Buradan ayarlarını değiştirmek istediğiniz kullanıcı rolünü seçebilirsiniz."
        placeholder="Bir kullanıcı rolü seçin"
        onChange={(value) => setGroup(getGroupIdFromArray(`${value}`) || null)}
        data={authorGroups.map((authorGroup) => authorGroup.name)}
        defaultValue={authorGroups[0]?.name}
        allowDeselect
      />
      <Box pos="relative">
        <Paper withBorder p="xs">
          <ScrollArea h={650}>
            <Paper withBorder p="xs" my="xs">
              <Text component="h3" size="md" fw={600} ta="center" my="xs">
                Kullanıcı Adı Rengi
              </Text>
              <ColorPicker
                mx="auto"
                format="hex"
                swatches={[
                  `${authorGroups.find((grp) => grp.id === group)?.color}`,
                  '#868e96',
                  '#fa5252',
                  '#e64980',
                  '#be4bdb',
                  '#7950f2',
                  '#4c6ef5',
                  '#228be6',
                  '#15aabf',
                  '#12b886',
                  '#40c057',
                  '#82c91e',
                  '#fab005',
                  '#fd7e14',
                ]}
                onChangeEnd={handleColorPickerChange}
                defaultValue="#000000"
                value={authorGroups.find((grp) => grp.id === group)?.color}
              />
            </Paper>
            <List>
              <Text component="h3" size="md" fw={600} ta="center" my="xs">
                Kullanıcı Rol İzinleri
              </Text>
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
  );
}
