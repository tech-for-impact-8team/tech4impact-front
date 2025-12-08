import api from './client';
import { useAuthStore } from '@app/stores/authStore';

export type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
} | null;

export const signUp = async (payload: SignUpPayload) => {
  const res = await api.post('auth/sign-up', { json: payload, credentials: 'include' });
  const body = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const b = body as { message?: string } | null;
    const msg = (b && b.message) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  const b = body as AuthResponse;
  if (b && b.access_token) {
    useAuthStore.getState().setAccessToken(b.access_token);
  }
  return body as AuthResponse;
};

export const signIn = async (payload: SignInPayload) => {
  const res = await api.post('auth/sign-in', { json: payload, credentials: 'include' });
  const body = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const b = body as { message?: string } | null;
    const msg = (b && b.message) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  const b = body as AuthResponse;
  if (b && b.access_token) {
    useAuthStore.getState().setAccessToken(b.access_token);
  }
  return body as AuthResponse;
};

export const logout = async () => {
  // Call server logout to clear httpOnly refresh cookie
  try {
    const response = await api.post('auth/logout', { credentials: 'include' });
    console.log(response);
  } catch (err) {
    // ignore network errors here; still clear client state
  }
  useAuthStore.getState().clear();
};
