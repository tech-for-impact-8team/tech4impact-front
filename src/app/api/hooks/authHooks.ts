import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { signIn, signUp, logout } from '../auth';
import type { SignInPayload, SignUpPayload, AuthResponse } from '../auth';

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: (data, variables, _onMutateResult, context) => {
      // 로그아웃 시 사용자/경사로 관련 캐시를 정리해준다.
      queryClient.removeQueries({ queryKey: ['me'] });
      queryClient.removeQueries({ queryKey: ['ramps'] });

      if (onSuccess) {
        onSuccess(data, variables, _onMutateResult, context);
      }
    },
    ...restOptions,
  });
};

export const useSignUp = (options?: UseMutationOptions<AuthResponse, Error, SignUpPayload>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<AuthResponse, Error, SignUpPayload>({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: (data, variables, _onMutateResult, context) => {
      // 회원가입 후에도 바로 내 정보/경사로 데이터를 다시 가져오도록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['ramps'] });

      if (onSuccess) {
        onSuccess(data, variables, _onMutateResult, context);
      }
    },
    ...restOptions,
  });
};

export const useSignIn = (options?: UseMutationOptions<AuthResponse, Error, SignInPayload>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<AuthResponse, Error, SignInPayload>({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (data, variables, _onMutateResult, context) => {
      // 로그인 성공 시 즉시 내 정보와 경사로 목록을 다시 가져오도록 한다.
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['ramps'] });

      if (onSuccess) {
        onSuccess(data, variables, _onMutateResult, context);
      }
    },
    ...restOptions,
  });
};
