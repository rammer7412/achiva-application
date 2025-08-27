import { create } from 'zustand';

type UserSignupState = {
  email: string;
  password: string;
  confirmPassword: string;
  birth: string; // YYYY-MM-DD
  nickname: string;
  profileImageUrl: string;
  gender: string;
  region: string;
  categories: string[];

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setBirth: (birth: string) => void;
  setNickname: (nickname: string) => void;
  setProfileImageUrl: (url: string) => void;
  setGender: (gender: string) => void;
  setRegion: (region: string) => void;
  setCategories: (categories: string[]) => void;
};

export const useUserSignupStore = create<UserSignupState>((set) => ({
  email: '',
  password: '',
  confirmPassword: '',
  birth: '',
  nickname: '',
  profileImageUrl: '',
  gender: '',
  region: '',
  categories: [],

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setBirth: (birth) => set({ birth }),
  setNickname: (nickname) => set({ nickname }),
  setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
  setGender: (gender) => set({ gender }),
  setRegion: (region) => set({ region }),
  setCategories: (categories) => set({ categories }),
}));
