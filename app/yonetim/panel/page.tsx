import { Metadata } from 'next/types';
import { Container } from '@mantine/core';
import { Dashboard } from '@/shared/components/admin/dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  description:
    'Site yönetim paneli. Yönetim paneli üzerinden site ayarları, kullanıcılar ve rolleri yönetebilirsiniz.',
};

export default async function Page() {
  return (
    <Container size="xl" px="xs">
      <Dashboard />
    </Container>
  );
}
