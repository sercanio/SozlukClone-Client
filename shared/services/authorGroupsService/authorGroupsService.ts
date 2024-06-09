/* eslint-disable @typescript-eslint/return-await */
import { Session } from 'next-auth';
import BackendService from '@/core/services/backendService/backendService';
import {
  AuthorGroupGetByIdResponse,
  AuthorGroupsGetAllResponse,
  UpdateAuhorGroupRequest,
} from '@/types/DTOs/AuthorGroupsDTOs';

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

  public async getById(id: number): Promise<AuthorGroupGetByIdResponse> {
    return this.backendService.get<AuthorGroupGetByIdResponse>(`AuthorGroups/${id}`);
  }

  public async update(
    id: number,
    data: UpdateAuhorGroupRequest
  ): Promise<AuthorGroupGetByIdResponse> {
    return await this.backendService.put('AuthorGroups', data);
  }
}
