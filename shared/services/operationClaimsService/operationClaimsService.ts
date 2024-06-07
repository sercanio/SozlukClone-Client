import { Session } from 'next-auth';
import BackendService from '@/core/services/backendService/backendService';

export default class OperationClaimsService {
  private backendService: BackendService;

  constructor(session: Session) {
    this.backendService = new BackendService(session);
  }

  public async getAll(pageIndex: number, pageSize: number): Promise<any> {
    return this.backendService.get(`OperationClaims?PageIndex=${pageIndex}&PageSize=${pageSize}`);
  }

  public async getById(id: number): Promise<any> {
    return this.backendService.get(`OperationClaims/${id}`);
  }
}
