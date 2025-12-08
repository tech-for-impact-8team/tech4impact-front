import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { signIn, signUp, logout } from '../auth';
import type { SignInPayload, SignUpPayload, AuthResponse } from '../auth';

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logout();
    },
    ...(options ?? {}),
  });
};

export const useSignUp = (options?: UseMutationOptions<AuthResponse, Error, SignUpPayload>) => {
  return useMutation<AuthResponse, Error, SignUpPayload>({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    ...(options ?? {}),
  });
};

export const useSignIn = (options?: UseMutationOptions<AuthResponse, Error, SignInPayload>) => {
  return useMutation<AuthResponse, Error, SignInPayload>({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    ...(options ?? {}),
  });
};
