import api from './client';

export type User = {
  id: number;
  email: string;
  name: string;
  phone?: string;
  nickname?: string;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get('users/me');
  const body = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const b = body as { message?: string } | null;
    const msg = (b && b.message) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return (body as User) || ({} as User);
};

export const getUser = async (id: number): Promise<User> => {
  const res = await api.get(`users/${id}`);
  const body = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const b = body as { message?: string } | null;
    const msg = (b && b.message) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return (body as User) || ({} as User);
};
