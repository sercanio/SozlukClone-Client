import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import {
  AuthorGroupOperationClaimAddClaimRequest,
  AuthorGroupOperationClaimGetByIdResponse,
  AuthorGroupOperationClaimsGetAllResponse,
} from '@/types/DTOs/AuthorGroupOperationClaimsDTOs';

export default class AuthorGroupOperationClaimsService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(
    pageIndex: number,
    pageSize: number
  ): Promise<AuthorGroupOperationClaimsGetAllResponse> {
    return this.backendService.get<AuthorGroupOperationClaimsGetAllResponse>(
      `AuthorGroupUserOperationClaims?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: number): Promise<AuthorGroupOperationClaimGetByIdResponse> {
    return this.backendService.get<AuthorGroupOperationClaimGetByIdResponse>(
      `AuthorGroupUserOperationClaims/${id}`
    );
  }

  public async addClaim(
    operationClaimId: number,
    authorGroupId: number
  ): Promise<AuthorGroupOperationClaimGetByIdResponse> {
    const data: AuthorGroupOperationClaimAddClaimRequest = { operationClaimId, authorGroupId };
    return this.backendService.post<
      AuthorGroupOperationClaimGetByIdResponse,
      AuthorGroupOperationClaimAddClaimRequest
    >('AuthorGroupUserOperationClaims', data);
  }

  public async removeClaim(id: string): Promise<void> {
    await this.backendService.delete<void>(`AuthorGroupUserOperationClaims/${id}`);
  }
}
