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

export interface AuthorGroupsGetAllResponse extends GetAllResponse<Author> {}

export interface GetByIdResponse extends Author {
  createdDate: string;
  user: {
    id: string;
    email: string;
    status: boolean;
  };
  titles: any[]; // Adjust this type accordingly if there are specific title types
}

export interface UpdateRequest extends Omit<Author, 'id' | 'userId'> {}

export interface UpdateResponse extends Author {}

export interface SearchByUserNameRequest {
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

export interface SearchByUserNameResponse extends Pick<Author, 'id' | 'userId' | 'userName'> {}
