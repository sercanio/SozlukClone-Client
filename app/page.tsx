import { Container } from '@mantine/core';
import Link from 'next/link';
import TitleService from '@/shared/services/title/TitleService';

export default async function HomePage() {
  const response = await TitleService.getAll();
  const data = await response.json();
  const titles = [...(await data.items)];
  return (
    <Container size="lg" px="lg">
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
