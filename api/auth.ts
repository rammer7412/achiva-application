// api/auth.ts
import { httpPost } from '@/utils/http';

export async function verifyEmailCode(params: { email: string; code: string }) {
  // 서버 스펙: POST /api/auth/verify-code (body={}, query: email, code)
  return await httpPost<null>('/api/auth/verify-code', {}, { params });
}

// (예시) 로그인
export async function login(body: { email: string; password: string }) {
  return await httpPost<{ accessToken: string; refreshToken?: string }>(
    '/api/auth/login',
    body
  );
}
