import BackendService from '@/core/services/backendService/backendService';
import { AuthorsRegisterRequest, AuthorsRegisterResponse } from '@/types/DTOs/AuthServiceDTOs';

export default class AuthService {
  private backendService: BackendService;

  constructor(session: any) {
    this.backendService = new BackendService(session);
  }

  async register(request: AuthorsRegisterRequest): Promise<AuthorsRegisterResponse> {
    try {
      const response = await this.backendService.post<
        AuthorsRegisterResponse,
        AuthorsRegisterRequest
      >('Authors', request);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }
}
