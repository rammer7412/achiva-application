// utils/secureToken.ts
import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'achiva_access_token';
const REFRESH_KEY = 'achiva_refresh_token';

// 웹/시뮬레이터 일부 환경 대비 메모리 폴백
let memoryStore: Record<string, string | null> = {
  [ACCESS_KEY]: null,
  [REFRESH_KEY]: null,
};

async function hasSecureStore() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

async function setItem(key: string, value: string | null) {
  if (await hasSecureStore()) {
    if (value == null) await SecureStore.deleteItemAsync(key);
    else await SecureStore.setItemAsync(key, value);
  } else {
    memoryStore[key] = value ?? null;
  }
}

async function getItem(key: string) {
  if (await hasSecureStore()) {
    return (await SecureStore.getItemAsync(key)) ?? null;
  } else {
    return memoryStore[key] ?? null;
  }
}

async function deleteItem(key: string) {
  if (await hasSecureStore()) {
    await SecureStore.deleteItemAsync(key);
  } else {
    memoryStore[key] = null;
  }
}

/** 액세스/리프레시 토큰 저장 (부분 업데이트 가능) */
export async function saveTokens(access?: string | null, refresh?: string | null) {
  if (typeof access !== 'undefined') {
    await setItem(ACCESS_KEY, access);
  }
  if (typeof refresh !== 'undefined') {
    await setItem(REFRESH_KEY, refresh);
  }
}

/** 토큰 둘 다 읽기 */
export async function loadTokens() {
  const [accessToken, refreshToken] = await Promise.all([
    getItem(ACCESS_KEY),
    getItem(REFRESH_KEY),
  ]);
  return { accessToken, refreshToken };
}

/** 액세스 토큰만 */
export async function getAccessToken() {
  return await getItem(ACCESS_KEY);
}

/** 리프레시 토큰만 */
export async function getRefreshToken() {
  return await getItem(REFRESH_KEY);
}

/** 두 토큰 모두 삭제 */
export async function clearTokens() {
  await Promise.all([deleteItem(ACCESS_KEY), deleteItem(REFRESH_KEY)]);
}

// 필요하면 키 상수도 export
export { ACCESS_KEY, REFRESH_KEY };

