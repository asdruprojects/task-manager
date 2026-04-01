import { useMutation } from '@tanstack/react-query';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@task-manager/contracts';
import { login, register } from './mutations';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: ['auth', 'login'],
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationKey: ['auth', 'register'],
    mutationFn: register,
  });
}
