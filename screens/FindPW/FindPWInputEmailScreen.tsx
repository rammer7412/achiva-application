import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import TitleWithBack from '@/components/header/TitleWithBack';
import LabeledInput from '@/components/inputbox/LabeledInput';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserFindPWStore } from '@/stores/useUserFindPWStore';
import type { ApiBaseResponse } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { api } from '@/utils/apiClients';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function FindPWInputEmailScreen() {
  const router = useRouter();
  const { scaleHeight, scaleWidth } = useResponsiveSize();

  const [userEmail, setUserEmail] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { setEmail } = useUserFindPWStore();

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

  type Available = { available: boolean };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const res = await api.get<ApiBaseResponse<Available>>('/api/auth/check-email', {
      params: { email },
      validateStatus: () => true,
    });
    if (res.data?.message?.includes('이미 사용 중인 이메일입니다.')) {
      return true;
    }
    else {
      return false;
    }
  };


type EmailSendType = { email: string; sended: boolean };

const sendVerificationCode = async (email: string) => {
  const res = await api.post<ApiBaseResponse<EmailSendType>>(
    '/api/auth/send-verification-code',
    null,
    { params: { email },
      validateStatus: () => true
    }
  );
  if (__DEV__) {
    console.log('[sendVerificationCode] status =', res.status);
    console.log('[sendVerificationCode] data   =', res.data);
  }

  const ok = res.data?.data?.sended === true;
  if (!ok) throw new Error(res.data?.message ?? '인증 코드 전송 실패');
  return res.data.data;
};


  const handlePress = async () => {
  const trimmed = userEmail.trim();

  if (!isValidEmail(trimmed)) {
    setIsError(true);
    setErrorMessage('유효하지 않은 이메일입니다.');
    return;
  }

  try {
    setIsError(false);
    setErrorMessage('');

    const exists = await checkEmailExists(trimmed);
    if (!exists) {
      setIsError(true);
      setErrorMessage('해당 이메일로 가입된 계정을 찾을 수 없습니다.');
      return;
    }
    console.log("hi1")
    await sendVerificationCode(trimmed);
    console.log("hi2");
    setEmail(trimmed);
    router.push('/findpw/findpwauthemail');
  } catch (e: any) {
    setIsError(true);
    setErrorMessage(e?.message || '이메일 확인 또는 인증 코드 전송 중 문제가 발생했습니다.');
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
        <TitleWithBack title="비밀번호 변경" />
        <NoticeMessageTitle
          message="비밀번호를 잊으셨나요?"
          subtitle="계정을 찾으시려면 가입하신 이메일을 입력해주세요."
        />

        <View style={{ marginTop: scaleHeight(20) }}>
          <LabeledInput
            value={userEmail}
            onChangeText={handleEmailChange}
            placeholder="이메일 주소를 입력합니다."
            hasError={isError}
            errorMessage={errorMessage}
          />
        </View>

        <ConfirmButton
          text={loading ? '처리중...' : '다음'}
          onPress={handlePress}
          disabled={loading || userEmail.trim() === ''}
        />
      </ScrollView>
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
