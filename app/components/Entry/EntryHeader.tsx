"use client"

import React from 'react'
import { Text } from '@mantine/core'
import useNotificationStore from '@/store/notificationStore';

function EntryHeader({ entryId }: { entryId: number }) {
    const showNotification = useNotificationStore((state) => state.showNotification);

    const copyToClipboard = async (text: string) => {
        navigator.clipboard.writeText(text).then(res => {
            showNotification({ title: 'kopyala', message: `tanım numarası kopyalandı: ${text}`, variant: 'success' });
        })
    };

    return (
        <Text
            size="xs"
            fw="light"
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard(entryId.toString())}
        >
            #{entryId}
        </Text>
    )
}

export default EntryHeader