import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import PasswordInput from '@/components/inputbox/PasswordInput';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserFindPWStore } from '@/stores/useUserFindPWStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

export default function CreatePWScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const email = useUserFindPWStore.getState();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {
    setPassword: setPasswordToStore,
    setConfirmPassword: setConfirmPasswordToStore,
  } = useUserFindPWStore();

  const isValidPassword = (pw: string): boolean => {
    return pw.length >= 8;
  };

  const handlePress = async () => {
    if (!isValidPassword(password)) {
      Alert.alert('유효하지 않은 비밀번호입니다', '8자 이상 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('비밀번호 불일치', '입력한 비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(
        'https://api.achiva.kr/api/auth/reset-password',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { accessToken, user } = response.data.data;

      console.log('✅ 초기화 성공', response.data);
      router.push('/(tab)/home');
    } catch (error: any) {
      console.error('❌ 로그인 오류:', error.response?.data || error.message);
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    }

    setPasswordToStore(password); //TODO
    setConfirmPasswordToStore(confirmPassword); //TODO
    router.push('/');
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
        <HeaderWithBack total={6} current={2} />

        <NoticeMessageTitle
          message="새로운 비밀번호 등록"
          subtitle="사용할 비밀번호를 입력해주세요."
        />

        <View
          style={{
            marginTop: scaleHeight(20),
            marginBottom: scaleHeight(20),
          }}
        >
          <PasswordInput
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
          />
          <PasswordInput
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            subtext="8~20자/영문, 숫자, 특수문자 포함"
          />
          <View style={{ marginTop: scaleHeight(32) }}>
            <ConfirmButton
              text="다음"
              onPress={handlePress}
              disabled={password.trim().length < 8}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
