import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import {
  TitlesGetAllResponse,
  TitlesGetByIdResponse,
  TitlesSearchRequest,
} from '@/types/DTOs/TitlesDTOs';

export default class TitlesService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<TitlesGetAllResponse> {
    return this.backendService.get<TitlesGetAllResponse>(`Titles?PageIndex=${pageIndex}&PageSize=${pageSize}`);
  }

  public async getById(id: number): Promise<TitlesGetByIdResponse> {
    return this.backendService.get<TitlesGetByIdResponse>(`Titles/${id}`);
  }

  public async getBySlug<TitlesGetByIdResponse>(slug: string, pageIndex: number, pageSize: number): Promise<TitlesGetByIdResponse> {
    return this.backendService.get<TitlesGetByIdResponse>(`Titles/GetBySlug?PageIndex=${pageIndex}&PageSize=${pageSize}&Slug=${slug}`);
  }

  public async getByName<TitlesGetByIdResponse>(name: string): Promise<TitlesGetByIdResponse> {
    return this.backendService.get<TitlesGetByIdResponse>(`Titles/GetByTitleName?Name=${name}`);
  }

  public async create<TitlesGetByIdResponse, TitlesPostRequest>(
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
