import { GetAllResponse } from './BaseDTOs';

export interface AuthorGroup {
  id: number;
  name: string;
  description: string;
}

export interface AuthorGroupsGetAllResponse extends GetAllResponse<AuthorGroup> {}

export interface GetByIdResponse {
  id: number;
  name: string;
  description: string;
}
