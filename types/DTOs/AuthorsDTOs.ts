import { GetAllResponse } from './BaseDTOs';
import { RelationsCreateResponse } from './RelationsDtos';

export interface Author {
  id: number;
  userId: string;
  userName: string;
  biography: string | null;
  profilePictureUrl: string | null;
  coverPictureUrl: string | null;
  age: number | null;
  gender: number | null;
  authorGroupId: number;
  activeBadgeId: number;
}

export interface AuthorsGetAllResponse extends GetAllResponse<Author> {}

export interface AuthorsGetByIdResponse extends Author {
  createdDate: string;
  user: {
    id: string;
    email: string;
    status: boolean;
  };
  titleCount: number;
  entryCount: number;
  followers : RelationsCreateResponse[];
  followings: RelationsCreateResponse[];
}

export type AuthorsUpdateRequest = Omit<Author, 'userName' | 'profilePictureUrl' | 'coverPictureUrl' | 'age' | 'gender'> & Partial<Pick<Author, 'userName' | 'profilePictureUrl' | 'coverPictureUrl' | 'age' | 'gender'>>;

export interface AuthorsUpdateResponse extends Author {}

export interface AuthorsSearchByUserNameRequest {
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

export type AuthorsSearchByUserNameItem = Pick<Author, 'id' | 'userId' | 'userName'> & {
  profileImage: string;
  email: string;
};

export interface AuthorsSearchByUserNameResponse extends GetAllResponse<AuthorsSearchByUserNameItem> {}

export interface EntryAuthorInTitle {
  id: number;
  userId: string;
  userName: string;
  profilePictureUrl: string;
  authorGroupId: number;
}
