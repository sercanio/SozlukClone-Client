import { Container } from '@mantine/core';
import TitleService from '@/shared/services/title/TitleService';
import { Dashboard } from '@/shared/components/admin/dashboard/Dashboard';

export default async function Page() {
  const response = await TitleService.getAll();
  const data = await response.json();
  const titles = [...(await data.items)];
  console.log(titles);

  return (
    <Container size="lg" px="xs">
      <Dashboard />
    </Container>
  );
}
