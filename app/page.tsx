import { Metadata, ResolvingMetadata } from 'next/types';
import { getServerSession, Session } from 'next-auth';
import { Container } from '@mantine/core';
import Link from 'next/link';
import TitlesService from '@/shared/services/titlesService/titlesService';
import { options } from './api/auth/[...nextauth]/options';
import GlobalSettingsService from '@/shared/services/globalSettingsService/globalSettingsService';

type Props = {
  params: { id: string; session: Session };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const session = await getServerSession(options);
  params.session = session!;

  const globalSettingsService = new GlobalSettingsService(session!);
  const globalSettings = await globalSettingsService.getById(1);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${globalSettings.siteName} - ${globalSettings.siteDescription}`,
    openGraph: {
      images: [`${globalSettings.siteLogo}`, ...previousImages],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const titleService = new TitlesService(params.session!);

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
