import { GetAllResponse } from './BaseDTOs';

export interface AuthorGroupOperationClaim {
  id: string;
  operationClaimId: number;
  authorGroupId: number;
}

export interface AuthorGroupOperationClaimGetByIdResponse {
  id: string;
  operationClaimId: number;
  authorGroupId: number;
}

export interface AuthorGroupOperationClaimsGetAllResponse
  extends GetAllResponse<AuthorGroupOperationClaim> {}

export interface AuthorGroupOperationClaimAddClaimRequest {
  operationClaimId: number;
  authorGroupId: number;
}

export interface AAuthorGroupOperationClaimddClaimResponse {
  id: string;
  operationClaimId: number;
  authorGroupId: number;
}

export interface RemoveClaimResponse {
  id: string;
}
