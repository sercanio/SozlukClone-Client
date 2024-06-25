import { EntryAuthorInTitle } from './AuthorsDTOs';
import { GetAllResponse } from './BaseDTOs';

export interface Title {
	id: number;
	slug: string;
	name: string;
	isLocked: boolean;
}

export interface Author {
	id: number;
	userId: string;
	userName: string;
	profilePictureUrl?: any;
	authorGroupId: number;
}

export interface Entry {
  id: number;
	content: string;
	createdDate: string;
	updatedDate?: any;
	likesCount: number;
	dislikesCount: number;
	favoritesCount: number;
	authorLike: boolean;
	authorDislike: boolean;
	authorFavorite: boolean;
	title: Title;
	author: Author;
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