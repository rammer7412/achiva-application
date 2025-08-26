export type ApiBaseResponse<T = unknown> = {
  status?: 'success' | 'error';
  code?: number;
  message?: string;
  data?: T;
};