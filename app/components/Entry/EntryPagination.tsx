"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import { Box, Pagination } from '@mantine/core'
import { TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs'

function EntryPagination({ pages, title, page, size }: { pages: number, title: TitlesGetByIdResponse, page: number, size: number }) {
    const router = useRouter();

    function paginationChangeHandler(page: number) {
        router.push(`${title.slug}?page=${page}&size=${size}`)
    }

    return (
        <Box style={{ maxWidth: "850px" }}>
            <Pagination pos="relative" size="xs" ml="auto" mr="xl" my="xs" px="sm" py="xs" right="xl" boundaries={1} value={page + 1} total={pages} onChange={paginationChangeHandler} style={{ width: "fit-content" }} />
        </Box>
    )
}

export default EntryPagination;