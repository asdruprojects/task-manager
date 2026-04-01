import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@task-manager/contracts';
import { api } from '../lib/api';

const AUTH_URL = '/api/auth';

export async function login(input: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>(`${AUTH_URL}/login`, input);
}

export async function register(
  input: RegisterRequest,
): Promise<RegisterResponse> {
  return api.post<RegisterResponse>(`${AUTH_URL}/register`, input);
}
