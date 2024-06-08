import { GetAllResponse } from './BaseDTOs';

export interface OperationClaim {
  id: string;
  userId: string;
  operationClaimId: number;
}

export interface OperationClaimsGetAllResponse extends GetAllResponse<OperationClaim> {}

export interface GetByIdResponse {
  id: string;
  userId: string;
  operationClaimId: number;
}
