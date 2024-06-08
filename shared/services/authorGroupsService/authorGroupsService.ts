import { Session } from 'next-auth';
import BackendService from '@/core/services/backendService/backendService';
import { GetByIdResponse } from '@/types/DTOs/AuthorGroupOperationClaimsDTOs';
import { AuthorGroupsGetAllResponse } from '@/types/DTOs/AuthorsDTOs';

export default class AuthorGroupsService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<AuthorGroupsGetAllResponse> {
    return this.backendService.get<AuthorGroupsGetAllResponse>(
      `AuthorGroups?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: number): Promise<GetByIdResponse> {
    return this.backendService.get<GetByIdResponse>(`AuthorGroups/${id}`);
  }
}
