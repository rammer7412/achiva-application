import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import LabeledInput from '@/components/inputbox/LabeledInput';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

export default function UsernameInputScreen() {
  const router = useRouter();
  const { nickname, setNickname } = useUserSignupStore();
  const [isValidLength, setIsValidLength] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { scaleHeight, scaleWidth } = useResponsiveSize();

  const handleChange = (text: string) => {
    const trimmed = text.trimStart(); // 앞 공백 축적 방지
    setNickname(trimmed);
    setIsValidLength(trimmed.trim().length >= 3); // 실제 글자 기준
    setIsNicknameChecked(false); // 값이 바뀌면 다시 체크 필요
  };

  // 명세: GET /api/auth/check-nickname?nickname=... (JWT 불필요)
  const checkNicknameDuplication = async (
    nickname: string
  ): Promise<{ available: boolean }> => {
    try {
      const response = await axios.get(
        'https://api.achiva.kr/api/auth/check-nickname',
        {
          params: { nickname },
          // 중복일 때 400/409 등을 2xx처럼 받아서 직접 분기
          validateStatus: () => true,
        }
      );

      console.log('📡 check-nickname status:', response.status);
      console.log('📦 check-nickname data:', response.data);

      // 정상(예시): { status, code, message, data: { available: true } }
      if (response.status === 200) {
        const available =
          response.data?.data?.available ?? response.data?.available;
        return { available: Boolean(available) };
      }

      // 명세 외 상태 처리: 400/409 등을 "중복"으로 간주
      if (response.status === 400 || response.status === 409) {
        return { available: false };
      }

      // 나머지는 서버 오류로 간주
      throw new Error(`Unexpected status: ${response.status}`);
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      throw new Error('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleCheckDuplicate = async () => {
    const target = nickname.trim();
    if (target.length < 3) return;

    try {
      setIsChecking(true);
      const { available } = await checkNicknameDuplication(target);

      if (available) {
        Alert.alert('사용 가능', '사용 가능한 이름입니다.');
        setIsNicknameChecked(true);
      } else {
        Alert.alert('중복된 이름', '이미 사용 중인 이름입니다.');
        setIsNicknameChecked(false);
      }
    } catch {
      Alert.alert('오류', '중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  const handlePress = () => {
    if (isValidLength && isNicknameChecked) {
      router.push('/signup/profilechoose');
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
        <HeaderWithBack total={6} current={4} />

        <NoticeMessageTitle
          message="사용자 이름 만들기"
          subtitle="사용자 이름을 직접 추가하거나 추천 이름을 사용하세요. 프로필에서 언제든지 변경할 수 있습니다."
        />

        <View
          style={{
            marginTop: scaleHeight(20),
            marginBottom: scaleHeight(20),
          }}
        >
          <LabeledInput
            label="Username"
            value={nickname}
            onChangeText={handleChange}
            placeholder="사용자 이름을 입력하세요"
            subtext="3자 이상으로 입력해주세요."
            rightButtonText="중복 체크"
            onPressRightButton={handleCheckDuplicate}
            rightButtonDisabled={!isValidLength || isChecking}
          />

          <ConfirmButton
            text="다음"
            onPress={handlePress}
            disabled={!isValidLength || !isNicknameChecked}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
