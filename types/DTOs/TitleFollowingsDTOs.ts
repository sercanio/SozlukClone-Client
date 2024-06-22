export interface TitleFollowing{
    titleId: number;
    authorId: number;
}

export interface TitleFollowingsCreateRequest extends TitleFollowing{}
export interface TitleFollowingsCreateResponse extends TitleFollowing{}

export interface TitleFollowingsDeleteRequest extends TitleFollowing{}
export interface TitleFollowingsDeleteResponse extends TitleFollowing{}