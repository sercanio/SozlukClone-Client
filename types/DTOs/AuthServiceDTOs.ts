export interface AuthorsRegisterRequest {
  userName: string;
  email: string;
  password: string;
  biography: string;
  profilePictureUrl: string;
  coverPictureUrl: string;
  age: number;
  gender: number;
}

export interface AuthorsRegisterResponse {
  id: number;
  userId: string;
  userName: string;
  biography: string;
  profilePictureUrl: string;
  coverPictureUrl: string;
  age: number;
  gender: number;
  authorGroupId: number;
  activeBadgeId: number;
}
