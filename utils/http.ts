import type { ApiBaseResponse } from '@/types/ApiTypes';
import { api } from '@/utils/apiClients';
import { AxiosError, AxiosRequestConfig } from 'axios';

function logHttpError(method: string, url: string, err: AxiosError<any>) {
  console.log(`[HTTP ${method} ERROR]`, {
    url,
    status: err.response?.status,
    data: err.response?.data,
    message: err.message,
  });
}

export async function httpPost<T = unknown>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<ApiBaseResponse<T>> {
  try {
    const res = await api.post<ApiBaseResponse<T>>(url, body ?? {}, config);
    return res.data;
  } catch (e) {
    const err = e as AxiosError<any>;
    logHttpError('POST', url, err);
    throw err;
  }
}

export async function httpGet<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiBaseResponse<T>> {
  try {
    const res = await api.get<ApiBaseResponse<T>>(url, config);
    return res.data;
  } catch (e) {
    const err = e as AxiosError<any>;
    logHttpError('GET', url, err);
    throw err;
  }
}

export async function httpPut<T = unknown>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<ApiBaseResponse<T>> {
  try {
    const res = await api.put<ApiBaseResponse<T>>(url, body ?? {}, config);
    return res.data;
  } catch (e) {
    const err = e as AxiosError<any>;
    logHttpError('PUT', url, err);
    throw err;
  }
}

export async function httpPatch<T = unknown>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<ApiBaseResponse<T>> {
  try {
    const res = await api.patch<ApiBaseResponse<T>>(url, body ?? {}, config);
    return res.data;
  } catch (e) {
    const err = e as AxiosError<any>;
    logHttpError('PATCH', url, err);
    throw err;
  }
}

/**
 * axios.delete는 body를 직접 인자로 받지 않고,
 * config.data로 전달해야 합니다.
 */
export async function httpDelete<T = unknown>(
  url: string,
  body?: any, // 필요 없으면 생략 가능
  config?: AxiosRequestConfig
): Promise<ApiBaseResponse<T>> {
  try {
    const res = await api.delete<ApiBaseResponse<T>>(url, {
      ...(config ?? {}),
      data: body, // ✅ DELETE 요청 바디는 여기로
    });
    return res.data;
  } catch (e) {
    const err = e as AxiosError<any>;
    logHttpError('DELETE', url, err);
    throw err;
  }
}
