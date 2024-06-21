import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import { RelationsCreateRequest, RelationsCreateResponse } from '@/types/DTOs/RelationsDtos';

export default class RelationsService {
    private backendService: BackendService;

    constructor(session: Session) {
        this.backendService = new BackendService(session);
    }

    public async getById(id: number): Promise<RelationsCreateResponse> {
        return this.backendService.get<RelationsCreateResponse>(`Relations/${id}`);
    }

    public async create<RelationsCreateResponse, RelationsCreateRequest>(
        data: RelationsCreateRequest
    ): Promise<RelationsCreateResponse> {
        return this.backendService.post<RelationsCreateResponse, RelationsCreateRequest>('Relations', data);
    }

    public async delete(id: string): Promise<void> {
        return this.backendService.delete(`Relations/${id}`);
    }

}
