import { useAuthStore } from '@/stores/useAuthStore'; // zustand 스토어
import { logoutAndRedirect } from '@/utils/logout'; // 401 처리시 로그아웃 유틸
import axios, { AxiosError } from 'axios';

export const BASE_URL = 'https://api.achiva.kr'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터: accessToken이 있으면 자동으로 Authorization 헤더에 붙임
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      // @ts-expect-error 타입 경고 회피
      config.headers = { ...(config.headers ?? {}), Authorization: `Bearer ${token}` };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료(401 등) 시 로그아웃 & 로그인 페이지로 이동
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<any>) => {
    if (err.response?.status === 401) {
      await logoutAndRedirect('/login');
    }
    return Promise.reject(err);
  }
);

export default api