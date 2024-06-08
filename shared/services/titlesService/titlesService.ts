import { Session } from 'next-auth';
import BackendService from '@/core/services/backendService/backendService';
import { TitlesGetAllResponse, GetByIdResponse } from '@/types/DTOs/TitlesDTOs';

export default class TitlesService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(): Promise<TitlesGetAllResponse> {
    return this.backendService.get<TitlesGetAllResponse>('Titles?PageIndex=0&PageSize=50');
  }

  public async getById(id: number): Promise<GetByIdResponse> {
    return this.backendService.get<GetByIdResponse>(`Titles/${id}`);
  }
}
