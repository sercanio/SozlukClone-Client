import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import {
  TitlesGetAllResponse,
  TitlesGetByIdResponse,
  TitlesPostRequest,
} from '@/types/DTOs/TitlesDTOs';

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

  public async create<TitlesGetByIdResponse>(
    data: TitlesPostRequest
  ): Promise<TitlesGetByIdResponse> {
    return this.backendService.post<TitlesGetByIdResponse, TitlesPostRequest>('Entries', data);
  }

  public async delete(id: number): Promise<void> {
    return this.backendService.delete(`Entries/${id}`);
  }
}
