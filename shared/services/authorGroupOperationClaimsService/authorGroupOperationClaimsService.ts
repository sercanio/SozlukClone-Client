import { Session } from 'next-auth';
import BackendService from '@/core/services/backendService/backendService';
import {
  AddClaimRequest,
  AddClaimResponse,
  AuthorGroupOperationClaimsGetAllResponse,
  GetByIdResponse,
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

  public async getById(id: number): Promise<GetByIdResponse> {
    return this.backendService.get<GetByIdResponse>(`AuthorGroupUserOperationClaims/${id}`);
  }

  public async addClaim(
    operationClaimId: number,
    authorGroupId: number
  ): Promise<AddClaimResponse> {
    const data: AddClaimRequest = { operationClaimId, authorGroupId };
    return this.backendService.post<AddClaimResponse, AddClaimRequest>(
      'AuthorGroupUserOperationClaims',
      data
    );
  }

  public async removeClaim(id: string): Promise<void> {
    await this.backendService.delete<void>(`AuthorGroupUserOperationClaims/${id}`);
  }
}
