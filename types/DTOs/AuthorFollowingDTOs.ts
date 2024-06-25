export interface AuthorFollowing{
    followingId: number;
    followerId: number;
}

export interface AuthorFollowingsCreateRequest extends AuthorFollowing{}
export interface AuthorFollowingsCreateResponse extends AuthorFollowing{}

export interface AuthorFollowingsDeleteRequest extends AuthorFollowing{}
export interface AuthorFollowingsDeleteResponse extends AuthorFollowing{}