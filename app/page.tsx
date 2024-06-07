import { Container } from '@mantine/core';
import Link from 'next/link';
import TitlesService from '@/shared/services/titlesService/titlesService';

export default async function HomePage() {
  const response = await TitlesService.getAll();
  const data = await response.json();
  const titles = [...(await data.items)];
  return (
    <Container size="xl" px="lg">
      <ul>
        {titles.map((title) => (
          <li key={title.slug}>
            <Link key={title} href={`/baslik/${title.slug}`} className="link">
              {title.name}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
