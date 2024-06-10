import BackendService from '@/core/services/backendService/backendService';
import {
  AuthorsGetAllResponse,
  AuthorsGetByIdResponse,
  AuthorsUpdateRequest,
  AuthorsUpdateResponse,
  AuthorsSearchByUserNameResponse,
  AuthorsSearchByUserNameRequest,
} from '@/types/DTOs/AuthorsDTOs';

export default class AuthorsService {
  private backendService: BackendService;

  constructor(session: any) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<AuthorsGetAllResponse> {
    return this.backendService.get<AuthorsGetAllResponse>(
      `Authors?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: number): Promise<AuthorsGetByIdResponse> {
    return this.backendService.get<AuthorsGetByIdResponse>(`Authors/${id}`);
  }

  public async update(author: AuthorsUpdateRequest): Promise<AuthorsUpdateResponse> {
    return this.backendService.put<AuthorsUpdateResponse, AuthorsUpdateRequest>('Authors', author);
  }

  public async searchByUserName(
    userName: string,
    pageIndex: number,
    pageSize: number
  ): Promise<AuthorsSearchByUserNameResponse> {
    const request: AuthorsSearchByUserNameRequest = {
      sort: [{ field: 'userName', dir: 'asc' }],
      filter: { field: 'userName', operator: 'contains', value: userName },
    };
    return this.backendService.post<
      AuthorsSearchByUserNameResponse,
      AuthorsSearchByUserNameRequest
    >(`Authors/Dynamic?PageIndex=${pageIndex}&PageSize=${pageSize}`, request);
  }
}
