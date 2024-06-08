import { getServerSession } from 'next-auth';
import { Container } from '@mantine/core';
import Link from 'next/link';
import TitlesService from '@/shared/services/titlesService/titlesService';
import { options } from './api/auth/[...nextauth]/options';

export default async function HomePage() {
  const session = await getServerSession(options);

  const titleService = new TitlesService(session!);

  const response = await titleService.getAll();
  const titles = [...(await response.items)];
  return (
    <Container size="xl" px="lg">
      <ul>
        {titles.map((title) => (
          <li key={title.slug}>
            <Link href={`/baslik/${title.slug}`} className="link">
              {title.name}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
