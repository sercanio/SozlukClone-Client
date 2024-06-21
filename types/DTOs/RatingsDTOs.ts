export interface Rating {
    id: string;
    entryId: number;
    authorId: number;
}

export interface RatingsCreateRequest extends Omit<Rating, 'id'> {}
export interface RatingsCreateResponse extends Pick<Rating, 'id'> {}
export interface RatingsDeleteRequest extends Pick<Rating, 'id'> {}
export interface RatingsDeleteResponse extends Pick<Rating, 'id'> {}
