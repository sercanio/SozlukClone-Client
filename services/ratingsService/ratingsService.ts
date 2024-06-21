import { Session } from 'next-auth';
import BackendService from '@services/backendService/backendService';
import { RatingsCreateRequest, RatingsCreateResponse, RatingsDeleteRequest, RatingsDeleteResponse } from '@/types/DTOs/RatingsDTOs';

export default class RatingsService {
    private backendService: BackendService;

    constructor(session: Session) {
        this.backendService = new BackendService(session);
    }


    public async createLike<RatingsCreateResponse, RatingsCreateRequest>(
        data: RatingsCreateRequest
    ): Promise<RatingsCreateResponse> {
        return this.backendService.post<RatingsCreateResponse, RatingsCreateRequest>('Likes', data);
    }

    public async createDislike<RatingsCreateResponse, RatingsCreateRequest>(
        data: RatingsCreateRequest
    ): Promise<RatingsCreateResponse> {
        return this.backendService.post<RatingsCreateResponse, RatingsCreateRequest>('Dislikes', data);
    }

    public async createFavorite<RatingsCreateResponse, RatingsCreateRequest>(
        data: RatingsCreateRequest
    ): Promise<RatingsCreateResponse> {
        return this.backendService.post<RatingsCreateResponse, RatingsCreateRequest>('Favorites', data);
    }

    public async deleteLike(id: string): Promise<void> {
        return this.backendService.delete(`Likes/${id}`);
    }

    public async deleteDislike(id: string): Promise<void> {
        return this.backendService.delete(`Dislikes/${id}`);
    }

    public async deleteFavorite(id: string): Promise<void> {
        return this.backendService.delete(`Favorites/${id}`);
    }
}
