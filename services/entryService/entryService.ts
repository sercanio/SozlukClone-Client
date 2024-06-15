import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import { TitlesGetAllResponse, TitlesGetByIdResponse } from '@/types/DTOs/TitlesDTOs';
import { EntriesPostRequest } from '@/types/DTOs/EntriesDTOs';

export default class EntriesService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<TitlesGetAllResponse> {
    return this.backendService.get<TitlesGetAllResponse>(
      `Entries?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: number): Promise<TitlesGetByIdResponse> {
    return this.backendService.get<TitlesGetByIdResponse>(`Entries/${id}`);
  }

  public async create<EntriesGetByIdResponse>(
    data: EntriesPostRequest
  ): Promise<EntriesGetByIdResponse> {
    return this.backendService.post<EntriesGetByIdResponse, EntriesPostRequest>('Entries', data);
  }

  public async delete(id: number): Promise<void> {
    return this.backendService.delete(`Entries/${id}`);
  }
}
