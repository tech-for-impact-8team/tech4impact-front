import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  setAccessToken: (token: string | null) => {
    if (token) {
      try {
        localStorage.setItem('accessToken', token);
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem('accessToken');
      } catch {
        // ignore
      }
    }
    set({ accessToken: token });
  },
  clear: () => {
    try {
      localStorage.removeItem('accessToken');
    } catch {
      // ignore
    }
    set({ accessToken: null });
  },
  isAuthenticated: () => !!get().accessToken,
}));
