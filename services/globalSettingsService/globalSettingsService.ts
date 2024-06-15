/* eslint-disable @typescript-eslint/return-await */
import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import {
  GlobalSettingsGetAllResponse,
  GlobalSettingsGetByIdResponse,
} from '@/types/DTOs/GlobalSettingsDTOs';

export default class GlobalSettingsService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<GlobalSettingsGetAllResponse> {
    return this.backendService.get<GlobalSettingsGetAllResponse>(
      `GlobalSettings?PageIndex=${pageIndex}&PageSize=${pageSize}`
    );
  }

  public async getById(id: number): Promise<GlobalSettingsGetByIdResponse> {
    return this.backendService.get<GlobalSettingsGetByIdResponse>(`GlobalSettings/${id}`);
  }

  public async update<GlobalSettingsGetByIdResponse>(
    formData: FormData
  ): Promise<GlobalSettingsGetByIdResponse> {
    return await this.backendService.updateFormData<GlobalSettingsGetByIdResponse>(
      'GlobalSettings',
      formData
    );
  }
}
