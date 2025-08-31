import { create } from 'zustand';

type UserFindPWState = {
  email: string;
  password: string;
  confirmPassword: string;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
};

export const useUserFindPWStore = create<UserFindPWState>((set) => ({
  email: '',
  password: '',
  confirmPassword: '',

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
}));
