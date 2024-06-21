"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import { useSession } from 'next-auth/react';
import RelationsService from '@/services/relationsService/relationsService';
import useNotificationStore from '@/store/notificationStore';
import useLoadingStore from '@/store/loadingStore';
import { RelationsCreateResponse } from '@/types/DTOs/RelationsDtos';

interface Props {
    authorId: number;
    followings: RelationsCreateResponse[];
}

function FollowingOperation({ authorId, followings }: Props) {
    const router = useRouter();
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const session = useSession()
    const relationsService = new RelationsService(session?.data!)

    const showNotification = useNotificationStore((state) => state.showNotification);
    const { showSpinnerOverlay, hideSpinnerOverlay, visible } = useLoadingStore();

    useEffect(() => {
        checkIfUserFollowed();
    }, [followings]);

    function checkIfUserFollowed() {
        console.log(followings);

        const followed = followings.some(relation => relation.followingId === authorId);
        setIsFollowing(followed);

    }

    function handleFollow() {
        showSpinnerOverlay();
        let data = {
            followerId: session?.data?.user.authorId,
            followingId: authorId,
        }

        relationsService.create(data).then((res: any) => {
            router.refresh();
            showNotification({ title: 'başarılı', message: "yazar takibe alındı", variant: 'success' });
        }).catch(err => {
            showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
        }).finally(() => {
            hideSpinnerOverlay();
        })
    }

    function handleUnfollow() {
        showSpinnerOverlay();
        const relation = followings.filter(relation => (relation.followingId === authorId) && (relation.followerId === session.data?.user.authorId))[0];

        relationsService.delete(`${relation.id}`).then((val: any) => {
            if (val.id) {
                router.refresh();
                showNotification({ title: 'başarılı', message: "yazar takipten çıkarıldı", variant: 'success' });
                followings.filter(relatione => relation.id !== val.id);
                setIsFollowing(false);
            } else {
                throw new Error("bir seyler ters gitti.")
            }
        }).catch(err => {
            showNotification({ title: 'başarısız', message: err.message, variant: 'error' });
        }).finally(() => {
            hideSpinnerOverlay();
        })
    }

    return (
        <Button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            disabled={visible}
        >
            {isFollowing ? 'takipten çık' : 'takip et'}
        </Button>
    );
}

export default FollowingOperation;
