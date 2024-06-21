import { EntryAuthorInTitle } from './AuthorsDTOs';
import { GetAllResponse } from './BaseDTOs';
import { Rating, RatingsCreateRequest, RatingsCreateResponse } from './RatingsDTOs';
import { TitlesGetByIdResponse } from './TitlesDTOs';

export interface Entry {
  id: number;
  content: string;
  authorId: number;
  titleId: number;
  title: TitlesGetByIdResponse;
  likes: Rating[];
  dislikes: Rating[];
  favorites: Rating[];
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

export interface UpdateEntryByUserRequest extends Omit<Entry, 'title' | 'authorId'> {}
export interface UpdateEntryByUserResponse extends Omit<Entry, 'title'>{}