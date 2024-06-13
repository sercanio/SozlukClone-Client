import { Session } from 'next-auth';
import BackendService from '@/core/services/backendService/backendService';
import {
  TitlesGetAllResponse,
  TitlesGetByIdResponse,
  TitlesPostRequest,
  TitlesSearchRequest,
} from '@/types/DTOs/TitlesDTOs';

export default class TitlesService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(): Promise<TitlesGetAllResponse> {
    return this.backendService.get<TitlesGetAllResponse>('Titles?PageIndex=0&PageSize=50');
  }

  public async getById(id: number): Promise<TitlesGetByIdResponse> {
    return this.backendService.get<TitlesGetByIdResponse>(`Titles/${id}`);
  }

  public async getBySlug<TitlesGetByIdResponse>(slug: string): Promise<TitlesGetByIdResponse> {
    return this.backendService.get<TitlesGetByIdResponse>(`Titles/GetBySlug?Slug=${slug}`);
  }

  public async create<TitlesGetByIdResponse>(
    data: TitlesPostRequest
  ): Promise<TitlesGetByIdResponse> {
    return this.backendService.post<TitlesGetByIdResponse, TitlesPostRequest>('Titles', data);
  }

  public async searchByTitle<TitlesGetByIdResponse>(
    title: string,
    pageIndex: number,
    pageSize: number
  ): Promise<TitlesGetByIdResponse> {
    const request: TitlesSearchRequest = {
      sort: [{ field: 'name', dir: 'asc' }],
      filter: { field: 'name', operator: 'contains', value: title },
    };
    return this.backendService.post<TitlesGetByIdResponse, TitlesSearchRequest>(
      `Titles/Dynamic?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      request
    );
  }
}
