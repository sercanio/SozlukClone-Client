import { EntryAuthorInTitle } from './AuthorsDTOs';
import { GetAllResponse } from './BaseDTOs';
import { TitlesGetByIdResponse } from './TitlesDTOs';

export interface Entry {
  id: number;
  content: string;
  authorId: number;
  titleId: number;
  title: TitlesGetByIdResponse
}

export interface EntriesGetAllResponse extends GetAllResponse<Entry> {}

export interface EntriesGetByIdResponse extends Entry { }

export interface EntriesPostRequest {
  content: string;
  authorId: number;
  titleId: number;
}

export interface EntryInTitle extends Entry {
  createdDate: string;
  updatedDate?: any;
  author: EntryAuthorInTitle;
}
