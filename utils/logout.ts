// utils/logoutAndRedirect.ts
import { useAuthStore } from '@/stores/useAuthStore';
import { clearTokens } from '@/utils/secureToken';
import { router } from 'expo-router';

// 중복 호출 방지용 플래그
let isLoggingOut = false;

/** 토큰/유저 상태 초기화 + 지정 경로로 이동 */
export async function logoutAndRedirect(targetPath: string = '/login') {
  if (isLoggingOut) return;
  isLoggingOut = true;

  try {
    useAuthStore.getState().clearAuth();
    await clearTokens();

  } finally {
    router.replace('/'); //TODO

    setTimeout(() => {
      isLoggingOut = false;
    }, 500);
  }
}

/** 라우팅 없이 상태/토큰만 정리하고 싶을 때 */
export async function logoutOnly() {
  useAuthStore.getState().clearAuth();
  await clearTokens();
}
