import { GetAllResponse } from './BaseDTOs';

export interface Title {
  id: number;
  name: string;
  authorId: number;
  isLocked: boolean;
  slug: string;
}

export interface TitlesGetAllResponse extends GetAllResponse<Title> {}

export interface GetByIdResponse extends Title {}
