import { Container } from '@mantine/core';
import { Dashboard } from '@/shared/components/admin/dashboard/Dashboard';

export default async function Page() {
  return (
    <Container size="xl" px="xs">
      <Dashboard />
    </Container>
  );
}
