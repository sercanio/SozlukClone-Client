"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import { Box, Pagination } from '@mantine/core'
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs'

function EntryPagination({ title, page, size }: { title: TitlesGetByIdResponse, page: number, size: number }) {
    const router = useRouter();

    function paginationChangeHandler(page: number) {
        router.push(`${title.slug}?page=${page}&size=${size}`)
    }

    return (
        <Box style={{ maxWidth: "850px" }}>
            <Pagination pos="relative" size="xs" ml="auto" mr="xl" my="xl" p="xl" right="xl" boundaries={1} value={page + 1} total={Math.ceil(title.entryCount / 10)} onChange={paginationChangeHandler} style={{ width: "fit-content" }} />
        </Box>
    )
}

export default EntryPagination;