import { GetAllResponse } from './BaseDTOs';

export interface AuthorGroupOperationClaim {
  id: string;
  operationClaimId: number;
  authorGroupId: number;
}

export interface AuthorGroupOperationClaimsGetAllResponse
  extends GetAllResponse<AuthorGroupOperationClaim> {}

export interface GetByIdResponse {
  id: string;
  operationClaimId: number;
  authorGroupId: number;
}

export interface AddClaimRequest {
  operationClaimId: number;
  authorGroupId: number;
}

export interface AddClaimResponse {
  id: string;
  operationClaimId: number;
  authorGroupId: number;
}

export interface RemoveClaimResponse {
  id: string;
}
