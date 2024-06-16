import { GetAllResponse } from './BaseDTOs';

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
  titles: any[]; // Adjust this type accordingly if there are specific title types
}

export interface AuthorsUpdateRequest extends Author {}

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

export interface AuthorsSearchByUserNameResponse
  extends GetAllResponse<AuthorsSearchByUserNameItem> {}

export interface EntryAuthorInTitle {
  id: number;
  userId: string;
  userName: string;
  profilePictureUrl: string;
  authorGroupId: number;
}

