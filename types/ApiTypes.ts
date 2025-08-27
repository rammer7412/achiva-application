export type ApiBaseResponse<T = unknown> = {
  status?: 'success' | 'error';
  code?: number;
  message?: string;
  data?: T;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: number;
  email: string;
  nickName: string;
  birth: string;            // "2000-01-01"
  gender: 'MALE' | 'FEMALE' | string;
  categories?: string[];    // ["공부", "운동"] 등
  profileImageUrl?: string;
  createdAt: string;        // ISO
};