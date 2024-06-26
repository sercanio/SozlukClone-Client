"use client";

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Flex, Group, Popover, Text, Textarea } from '@mantine/core'
import AuthorsService from '@/services/authorsService/authorsService';
import useLoadingStore from '@/store/loadingStore';
import useNotificationStore from '@/store/notificationStore';
import { AuthorsGetByIdResponse, AuthorsUpdateRequest } from '@/types/DTOs/AuthorsDTOs';

interface Props {
    author: AuthorsGetByIdResponse
}

function AuthorEditBio({ author }: Props) {
    const router = useRouter()
    const session = useSession();
    const authorsService = new AuthorsService(session.data!);

    const [authorBio, setAuthorBio] = useState<string | null>(null);

    const showNotification = useNotificationStore((state) => state.showNotification);
    const { showSpinnerOverlay, hideSpinnerOverlay } = useLoadingStore();

    useEffect(() => {
        setAuthorBio(author.biography);
    }, [])


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        showSpinnerOverlay();
        const data: AuthorsUpdateRequest = {
            id: author.id,
            userId: author.userId,
            userName: author.userName,
            biography: authorBio as string,
            activeBadgeId: author.activeBadgeId,
            authorGroupId: author.authorGroupId
        };
        authorsService.update(data).then((res) => {
            if (res.biography === authorBio) {
                router.refresh();
                showNotification({ title: 'başarılı', message: "bıyografı güncellendi", variant: 'success' });
            }
        }).catch((err) => {
            showNotification({ title: 'Başarısız', message: err?.message, variant: 'error' });
        }).finally(() => {
            hideSpinnerOverlay();
        });
    }

    return (
        <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <Button px="none" variant="transparent">biyografiyi düzenle</Button>
            </Popover.Target>
            <Popover.Dropdown>
                <form onSubmit={handleSubmit}>
                    <Flex direction="column" gap="sm">
                        <Textarea label="biyografi" value={authorBio as string} onChange={(event) => setAuthorBio(event.currentTarget.value)} />
                        <Button type="submit" variant='light' w="fit-content" ml="auto">kaydet</Button>
                    </Flex>
                </form>
            </Popover.Dropdown>
        </Popover>
    )
}

export default AuthorEditBio