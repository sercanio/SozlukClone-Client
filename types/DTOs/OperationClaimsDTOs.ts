import { GetAllResponse } from './BaseDTOs';

export interface OperationClaim {
  id: number;
  name: string;
}

export interface OperatinClaimsGetByIdResponse {
  id: number;
  name: string;
}

export interface OperationClaimsGetAllResponse extends GetAllResponse<OperationClaim> {}
