// api/auth.ts
import type { ApiBaseResponse } from '@/types/ApiTypes';
import { LoginRequest, LoginUser } from '@/types/ApiTypes';
import { api } from '@/utils/apiClients';
import { httpPost } from '@/utils/http';
import type { AxiosRequestConfig } from 'axios';

export async function verifyEmailCode(params: { email: string; code: string }) {
  // 서버 스펙: POST /api/auth/verify-code (body={}, query: email, code)
  return await httpPost<null>('/api/auth/verify-code', {}, { params });
}

export async function login(
  body: LoginRequest,
  headers?: AxiosRequestConfig,
) {
  const res = await api.post<ApiBaseResponse<LoginUser>>(
    '/api/auth/login',
    body,
    headers,
  );

  return res;
}
