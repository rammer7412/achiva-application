import type { AuthState } from '@/types/AuthState';
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setAuth: (token, user, refreshToken = null) =>
    set({ accessToken: token, user, refreshToken }),

  setTokens: (token, refreshToken = null) =>
    set({ accessToken: token, refreshToken }),

  setUser: (user) => set({ user }),

  clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),

}));
