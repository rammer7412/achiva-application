import { useUserSignupStore } from '@/stores/useUserSignupStore';
import authApi from '@/utils/authApi';
import React, { useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';

type Props = { size: number; focused: boolean };

export default function ProfileTabAvatar({ size, focused }: Props) {
  // 가입 단계에서 저장한 accessUrl (없을 수도 있음)
  const signupUrl = useUserSignupStore((s) => s.profileImageUrl);

  const [uri, setUri] = useState<string | null>(signupUrl || null);
  const fetchedOnce = useRef(false);

  // 가입 단계에서 값이 바뀌면 즉시 반영
  useEffect(() => {
    if (signupUrl) setUri(signupUrl);
  }, [signupUrl]);

  // 로그인 후 서버에 저장된 이미지가 있으면 그걸 우선 사용
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    (async () => {
      try {
        const res = await authApi.get('/api/members/me');
        const url =
          res?.data?.data?.profileImageUrl ??
          res?.data?.profileImageUrl ??
          null;
        if (url) setUri(String(url));
      } catch {
        // 비로그인/오류면 스토어 값(있다면)만 사용
      }
    })();
  }, []);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: '#DDD', // 이미지 없을 때 회색 원
        borderWidth: focused ? 2 : 1,
        borderColor: focused ? '#442727' : 'rgba(0,0,0,0.15)',
      }}
      pointerEvents="none"
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
}
