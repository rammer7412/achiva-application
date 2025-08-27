import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { BASE_URL } from '@/utils/authApi'; // BASE_URL만 사용
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

export default function PledgeScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const {
      email,
      password,
      confirmPassword,
      nickname,
      profileImageUrl, // ← ProfileChooseScreen에서 이미 S3 accessUrl 저장됨
      birth,
      gender,
      region,
      categories,
    } = useUserSignupStore.getState();

    const payload = {
      email,
      password,
      confirmPassword,
      nickName: nickname,
      profileImageUrl: profileImageUrl || '',
      birth,
      gender: (gender || 'MALE').toUpperCase(), // enum 대응
      region: region || 'Seoul',
      categories,
    };

    try {
      setLoading(true);
      console.log('📤 register payload:', JSON.stringify(payload, null, 2));

      await axios.post(`${BASE_URL}/api/auth/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // 완료 알림은 생략하고 바로 완료 화면으로 이동 (중복 문구 방지)
      router.replace('/finishsignup'); // ✅ 변경: 완료 화면으로
    } catch (error: any) {
      console.error('❌ 회원가입 오류:', error?.response?.data || error.message);
      Alert.alert(
        '오류',
        error?.response?.data?.message || '회원가입 과정에서 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleWidth(24),
          backgroundColor: '#fff',
        }}
      >
        <HeaderWithBack total={6} current={5} />

        <NoticeMessageTitle
          message="서약서"
          subtitle="Achiva를 이용하기 전, 꼭 해야할 서약이예요."
        />

        {/* TODO: 서약서 본문 추가 */}

        <View
          style={{
            marginTop: 'auto',
            marginBottom: scaleHeight(40),
          }}
        >
          <ConfirmButton
            text={loading ? '가입 중...' : '다음'}
            onPress={handleNext}
            disabled={loading}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
