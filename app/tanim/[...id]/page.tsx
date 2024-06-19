import React from 'react'
import { Text } from '@mantine/core';
import { options } from '@/app/api/auth/[...nextauth]/options';
import EntriesService from '@/services/entryService/entryService';
import { EntriesGetByIdResponse } from '@/types/DTOs/EntriesDTOs';
import { Metadata } from 'next';
import { Session, getServerSession } from 'next-auth';
import EntryCard from '@/app/components/Entry/EntryCard';

type Props = {
    params: { id: string; session: Session; slug: string; }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const session = await getServerSession(options);
    params.session = session!;
    const entriesService = new EntriesService(session!);

    const entry: EntriesGetByIdResponse = await entriesService.getById(+params.id);

    return {
        title: `${entry.title.name}`,
    };
}

async function Page({ params }: Props) {

    const { session, slug } = params
    const entriesService = new EntriesService(session!);

    const entry: EntriesGetByIdResponse = await entriesService.getById(+params.id);

    return (
        <EntryCard entry={entry} title={entry.title} index={0} session={session} />
    )
}

export default Page