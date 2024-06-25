"use client";

import { Divider, Flex, NavLink } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import EntriesService from '@/services/entryService/entryService';
import { useSession } from 'next-auth/react';
import { AuthorsGetByIdResponse } from '@/types/DTOs/AuthorsDTOs';
import { EntriesGetAllResponse } from '@/types/DTOs/EntriesDTOs';
import EntryCard from '../Entry/EntryCard';
import { Session } from 'next-auth';
import RatingsService from '@/services/ratingsService/ratingsService';


interface Props {
    author: AuthorsGetByIdResponse;
}

function AuthorProfileEntriesList({ author }: Props) {
    const session = useSession();
    const [entries, setEntries] = useState<EntriesGetAllResponse>();
    const [activeTab, setActiveTab] = useState<string>();

    const entriesService = new EntriesService(session.data!);
    const ratingsService = new RatingsService(session.data!);

    useEffect(() => {
        setLatestEntries();
    }, [])


    function setLatestEntries() {
        entriesService.getAllByAuthorId(0, 10, author.id).then((res) => {
            setEntries(res)
            setActiveTab('latest')
        })
    }

    function setMostLikedEntries() {
        entriesService.getMostLikedAllByAuthorId(0, 10, author.id).then((res) => {
            setEntries(res);
            setActiveTab('mostLiked')
        })
    }

    function setMostFavoritedEntries(){
        entriesService.getMostFavoritedEntriesByAuthorId(0, 10, author.id).then((res) => {          
            setEntries(res);
            setActiveTab('mostFavorited')
        })
    }
    
    function setFavoriteEntriesOftheAuthor(){
        entriesService.getFavoriteEntriesOfAuthorByAuthorId(0, 10, author.id).then((res) => {
            setEntries(res);
            setActiveTab('favorites')
        })
    }
    console.log(entries);
    

    return (
        <div>
            <Divider my="none" />
            <Flex px="md" gap="sm">
                <NavLink color="cyan.4" variant="light" autoContrast label="tanımları" w="fit-content" active={activeTab === 'latest'} onClick={() => setLatestEntries()} />
                <NavLink color="cyan.4" variant="light" autoContrast label="en beğenilen" w="fit-content" active={activeTab === 'mostLiked'} onClick={() => setMostLikedEntries()} />
                <NavLink color="cyan.4" variant="light" autoContrast label="en çok favorilenen" w="fit-content" active={activeTab === 'mostFavorited'} onClick={() => setMostFavoritedEntries()} />
                <NavLink color="cyan.4" variant="light" autoContrast label="favorileri" w="fit-content" active={activeTab === 'favorites'} onClick={() => setFavoriteEntriesOftheAuthor()} />
            </Flex>
            <Divider my="none" />
            <>
                {entries?.items.map((entry, index) => <EntryCard
                    key={activeTab=='favorites'? entry?.entry.id : entry.id}
                    entry={activeTab=='favorites'? entry?.entry : entry}
                    index={index}
                    session={session as unknown as Session}
                    title={activeTab=='favorites'? entry?.entry.title : entry.title}
                />
                )
                }
            </>
        </div>
    )
}

export default AuthorProfileEntriesList