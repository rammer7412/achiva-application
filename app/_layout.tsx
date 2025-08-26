
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync().catch(() => { /* already prevented */ });

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    'Pretendard-Variable': require('@/assets/fonts/Pretendard-Variable.ttf'),
    'Pretendard-Thin': require('@/assets/fonts/Pretendard-Thin.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-ExtraBold': require('@/assets/fonts/Pretendard-ExtraBold.otf'),
  });

  const [hydrated, setHydrated] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { accessToken } = await loadTokens();
  //       if (accessToken) {
  //         (authApi.defaults.headers as any).common = (authApi.defaults.headers as any).common || {};
  //         authApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  //         try {
  //           const me = await authApi.get('/api/members/me');
  //           const d = (me?.data?.data ?? {}) as any;
  //           const user: User = {
  //             id: Number(d?.id) || 0,
  //             email: String(d?.email || ''),
  //             nickName: String(d?.nickName || ''),
  //             profileImageUrl: d?.profileImageUrl || undefined,
  //           };
  //           useAuthStore.getState().setAuth(accessToken, user, null);
  //           if (__DEV__) console.log('🟢 session restored via /me');
  //         } catch (e) {
  //           await clearTokens();
  //           useAuthStore.getState().clearAuth();
  //           try { if ((authApi.defaults.headers as any)?.common) delete (authApi.defaults.headers as any).common.Authorization; } catch {}
  //           if (__DEV__) console.log('❌ /me failed. cleared local session.');
  //         }
  //       } else {
  //         useAuthStore.getState().clearAuth();
  //         try { if ((authApi.defaults.headers as any)?.common) delete (authApi.defaults.headers as any).common.Authorization; } catch {}
  //       }
  //     } finally {
  //       setHydrated(true);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    if ((fontsLoaded || fontsError) && hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontsError, hydrated]);

  if ((!fontsLoaded && !fontsError) || !hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="signup" options={{ animation: 'fade' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
