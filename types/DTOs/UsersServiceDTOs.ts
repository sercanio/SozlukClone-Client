export interface User {
  id: string;
  email: string;
  name: string;
  groupId: number;
  accessToken: string;
}

export interface UserResponse {
  user: User;
}

export interface GetUserFromAuthResponse {
  id: string;
  email: string;
  name: string;
  groupId: number;
  accessToken: string;
}
