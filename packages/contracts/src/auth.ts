export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserPayload;
}

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  lastName: string;
}
