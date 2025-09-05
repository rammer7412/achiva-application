// screens/FinishSignupScreen.tsx
import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import ACHIVALogo from '@/components/logo/ACHIVA-logo';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function FinishSignupScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  const sizes = {
    gapTop: scaleHeight(10),          // 로고 아래 간격
    gapCheck: scaleHeight(28),        // 서브텍스트 아래 체크 버튼 간격
    iconSize: scaleWidth(64),         // 체크 아이콘 크기
    circle: Math.min(scaleWidth(120), scaleHeight(120)), // 원 버튼
    subFont: scaleFont(24),           // ← 더 크게
    sidePad: scaleWidth(24),          // 좌우 여백
    bottomGap: scaleHeight(128),       // 하단 버튼 여백
  };

  const handleDone = () => {
    router.replace('/login');
  };

  return (
    <ScreenContainer>
      <View style={[styles.fillWhite, { paddingHorizontal: sizes.sidePad }]}>
        {/* 가운데 콘텐츠 */}
        <View style={styles.center}>
          <ACHIVALogo/>

          <Text
            style={[
              styles.subText,
              { marginTop: sizes.gapTop, fontSize: sizes.subFont },
            ]}
            accessibilityRole="text"
          >
            회원가입 완료
          </Text>

          <Pressable
            onPress={handleDone}
            accessibilityRole="button"
            accessibilityLabel="완료"
            style={[
              styles.checkCircle,
              {
                marginTop: sizes.gapCheck,
                width: sizes.circle,
                height: sizes.circle,
                borderRadius: sizes.circle / 2,
              },
            ]}
          >
            {/* TODO: 추후 커스텀 체크 아이콘으로 교체 */}
            <Ionicons name="checkmark" size={sizes.iconSize} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* 하단 완료 버튼 */}
        <View style={{ marginTop: 'auto', marginBottom: sizes.bottomGap }}>
          <ConfirmButton text="완료" onPress={handleDone} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fillWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText: {
    color: '#111111',
    fontWeight: '700',
    textAlign: 'center',
  },
  checkCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F2F2F',
    elevation: 2,
  },
});
