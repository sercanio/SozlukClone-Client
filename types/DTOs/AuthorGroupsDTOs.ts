import { GetAllResponse } from './BaseDTOs';

export interface AuthorGroup {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface AuthorGroupsGetAllResponse extends GetAllResponse<AuthorGroup> {}

export interface AuthorGroupGetByIdResponse {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface UpdateAuhorGroupRequest {
  id: number;
  name?: string;
  description?: string;
  color?: string;
}
