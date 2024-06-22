export interface TitleBlocking{
    titleId: number;
    authorId: number;
}

export interface TitleBlockingsCreateRequest extends TitleBlocking{}
export interface TitleBlockingsCreateResponse extends TitleBlocking{}

export interface TitleBlockingsDeleteRequest extends TitleBlocking{}
export interface TitleBlockingsDeleteResponse extends TitleBlocking{}