import { Session } from 'next-auth';
import BackendService from '@/core/services/backendService/backendService';
import { OperationClaimsGetAllResponse } from '@/types/DTOs/OperationClaimsDTOs';

export default class OperationClaimsService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<OperationClaimsGetAllResponse> {
    return this.backendService.get<OperationClaimsGetAllResponse>(
      `OperationClaims?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: string): Promise<OperationClaimsGetAllResponse> {
    return this.backendService.get<OperationClaimsGetAllResponse>(`OperationClaims/${id}`);
  }
}
