import ConfirmButton from '@/components/buttons/ConfirmButton';
import HeaderWithBack from '@/components/HeaderWithBack';
import LabeledInput from '@/components/InputBox/LabeledInput';
import ScreenContainer from '@/components/ScreenContainer';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useKeyboardAnimatedButton } from '@/utils/useKeyboardAnimatedButton';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const { scaleHeight, scaleWidth } = useResponsiveSize();
  const [userEmail, setUserEmail] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false); // ★ 중복 클릭 방지
  const { setEmail } = useUserSignupStore();

  const buttonBottom = useKeyboardAnimatedButton(scaleHeight(120));

  const isValidEmail = (email: string): boolean => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setUserEmail(text);
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  // 명세: POST /api/auth/send-verification-code, email은 query에 전달, body 없음
  const sendVerificationCode = async (email: string) => {
    try {
      const response = await axios.post(
        'https://api.achiva.kr/api/auth/send-verification-code',
        null, // 바디 없음
        { params: { email } } // 쿼리스트링으로 전달
      );
      return response.data;
    } catch (error: any) {
      if (__DEV__) {
        if (error.response) {
          console.error('서버 응답 에러:', error.response.status, error.response.data);
        } else {
          console.error('네트워크 또는 기타 에러:', error.message);
        }
      }
      throw new Error('인증코드 요청 중 오류가 발생했습니다.');
    }
  };

  // 반환값을 일관되게 { available: boolean }로 맞춤
  const checkEmailDuplication = async (
    email: string
  ): Promise<{ available: boolean }> => {
    try {
      const response = await axios.get(
        'https://api.achiva.kr/api/auth/check-email',
        {
          params: { email },
          validateStatus: () => true, // 모든 상태 허용(에러를 catch로 던지지 않음)
        }
      );

      // 서버에서 중복 시 400/409 등을 줄 수 있어 대비
      if (response.status === 400 || response.status === 409) {
        return { available: false };
      }

      // 데이터 모양이 { available: boolean } 이거나 { data: { available: boolean } }일 수 있음
      const fromTop =
        typeof response.data?.available === 'boolean'
          ? response.data.available
          : undefined;
      const fromNested =
        typeof response.data?.data?.available === 'boolean'
          ? response.data.data.available
          : undefined;

      if (typeof fromTop === 'boolean') return { available: fromTop };
      if (typeof fromNested === 'boolean') return { available: fromNested };

      // 모양이 다르면 2xx는 사용 가능, 그 외는 불가로 취급
      return { available: response.status >= 200 && response.status < 300 };
    } catch (error) {
      if (__DEV__) console.error('❌ 이메일 중복 확인 실패:', error);
      throw new Error('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handlePress = async () => {
    if (submitting) return; // ★ 중복 클릭 가드

    const trimmedEmail = userEmail.trim();

    if (!isValidEmail(trimmedEmail)) {
      setIsError(true);
      setErrorMessage('유효하지 않은 이메일입니다.');
      return;
    }

    try {
      setSubmitting(true); // ★ 요청 시작

      const { available } = await checkEmailDuplication(trimmedEmail);
      if (!available) {
        setIsError(true);
        setErrorMessage('이미 사용 중인 이메일입니다.');
        return; // finally에서 submitting=false 됩니다.
      }

      await sendVerificationCode(trimmedEmail);
      setEmail(trimmedEmail);
      router.push('/emailauth');
    } catch (error) {
      Alert.alert('오류', '이메일 인증 요청 중 문제가 발생했습니다.');
    } finally {
      setSubmitting(false); // ★ 요청 종료
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: scaleWidth(24),
            paddingTop: scaleHeight(20),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <HeaderWithBack total={6} current={1} />
        <NoticeMessageTitle message="이메일 주소를 알려주세요." />

        <View style={{ marginTop: scaleHeight(20) }}>
          <LabeledInput
            value={userEmail}
            onChangeText={handleEmailChange}
            placeholder="이메일 주소를 입력합니다."
            hasError={isError}
            errorMessage={errorMessage}
          />
        </View>
      </ScrollView>

      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            left: scaleWidth(24),
            right: scaleWidth(24),
            bottom: buttonBottom,
          },
        ]}
      >
        <ConfirmButton
          text={submitting ? '요청 중...' : '다음'}          // ★ 로딩 문구
          onPress={handlePress}
          disabled={submitting || userEmail.trim() === ''} // ★ 비활성화
        />
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    position: 'absolute',
  },
});
