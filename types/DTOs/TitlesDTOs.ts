import { GetAllResponse } from './BaseDTOs';
import { EntryInTitle } from './EntriesDTOs';

export interface Title {
  id: number;
  name: string;
  authorId: number;
  isLocked: boolean;
  slug: string;
  entryCount: number;
  entries: EntryInTitle[];
}

export interface TitlesGetAllResponse extends GetAllResponse<Title> {}

export interface TitlesGetByIdResponse extends Title {}

export interface TitlesPostRequest {
  name: string;
  authorId: number;
}

export interface TitlesPostResponse {
  id: number;
}

export interface TitlesSearchRequest {
  sort: {
    field: string;
    dir: 'asc' | 'desc';
  }[];
  filter: {
    field: string;
    operator: 'contains';
    value: string;
  };
}

export interface TitleSearchResponse extends GetAllResponse<Title> {}
