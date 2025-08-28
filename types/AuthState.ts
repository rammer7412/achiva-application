import { User } from '@/types/User';

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setAuth: (token: string, user: User, refreshToken?: string | null) => void;
  setTokens: (token: string | null, refreshToken?: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
};