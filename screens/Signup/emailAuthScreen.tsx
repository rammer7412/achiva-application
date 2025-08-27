import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import VerificationCodeInput from '@/components/inputbox/VerificationCodeInput';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function EmailAuthScreen() {
  const { email } = useUserSignupStore();
  const [code, setCode] = useState('');
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const codeLength = 4;

  const handlePress = async () => {
  if (code.length !== codeLength) return;

  try {
    await axios.post(
      'https://api.achiva.kr/api/auth/verify-code',
      {},
      {
        params: {
          email,
          code,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    router.push('/createpw');
  } catch (error: any) {
    const response = error.response?.data;

    if (response?.code === 1005) {
      Alert.alert('인증 실패', '인증 코드가 틀렸습니다.');
    } else {
      console.error('인증 실패:', response || error.message);
      Alert.alert('오류', '인증 요청 중 문제가 발생했습니다.');
    }
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
        <HeaderWithBack total={6} current={1} />

        <NoticeMessageTitle
          message="이메일 인증"
          subtitle={
            <>
              <Text style={{ fontWeight: 'bold', color: '#000' }}>{email}</Text> 주소로 전송된 6자리 코드를 입력하세요.
            </>
          }
        />

        <VerificationCodeInput code={code} setCode={setCode} length={codeLength} />

        <View style={{ marginTop: scaleHeight(32) }}>
          <ConfirmButton
            text="다음"
            onPress={handlePress}
            disabled={code.length !== codeLength}
          />
        </View>

        <TouchableOpacity
          style={{
            marginTop: scaleHeight(16),
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#555',
              textDecorationLine: 'underline',
              fontSize: scaleFont(16),
            }}
          >
            코드를 받지 못했습니다
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
