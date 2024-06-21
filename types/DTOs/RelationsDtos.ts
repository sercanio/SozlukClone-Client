export interface Relation {
    id: number;
    followerId: number;
    followingId: number;
}

export interface RelationsCreateRequest extends Relation{}
export interface RelationsCreateResponse extends Relation{}