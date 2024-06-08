import BackendService from '@/core/services/backendService/backendService';
import {
  AuthorGroupsGetAllResponse,
  GetByIdResponse,
  UpdateRequest,
  UpdateResponse,
  SearchByUserNameRequest,
  SearchByUserNameResponse,
} from '@/types/DTOs/AuthorsDTOs';

export default class AuthorsService {
  private backendService: BackendService;

  constructor(session: any) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<AuthorGroupsGetAllResponse> {
    return this.backendService.get<AuthorGroupsGetAllResponse>(
      `Authors?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: number): Promise<GetByIdResponse> {
    return this.backendService.get<GetByIdResponse>(`Authors/${id}`);
  }

  public async update(author: UpdateRequest): Promise<UpdateResponse> {
    return this.backendService.put<UpdateResponse, UpdateRequest>('Authors', author);
  }

  public async searchByUserName(
    userName: string,
    pageIndex: number,
    pageSize: number
  ): Promise<SearchByUserNameResponse[]> {
    const request: SearchByUserNameRequest = {
      sort: [{ field: 'userName', dir: 'asc' }],
      filter: { field: 'userName', operator: 'contains', value: userName },
    };
    return this.backendService.post<SearchByUserNameResponse[], SearchByUserNameRequest>(
      `Authors/Dynamic?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      request
    );
  }
}
