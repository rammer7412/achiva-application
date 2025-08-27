import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StepIndicator from './StepIndicator';

type Props = {
  total: number;
  current: number;
  /** 우측 버튼(선택). 전달하면 버튼이 표시됩니다. */
  rightButton?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
  /** 뒤로가기 동작을 커스텀하고 싶을 때(선택) */
  onBackPress?: () => void;
};

export default function HeaderWithBack({ total, current, rightButton, onBackPress }: Props) {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont, safeArea } = useResponsiveSize();

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: safeArea.top + scaleHeight(10),
          paddingTop: scaleHeight(30),
        },
      ]}
    >
      <View
        style={[
          styles.headerRow,
          {
            paddingHorizontal: scaleWidth(16),
            paddingBottom: scaleHeight(12),
          },
        ]}
      >
        {/* 좌측: 뒤로 */}
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.sideLeft, { width: scaleWidth(40) }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={scaleWidth(24)} color="black" />
        </TouchableOpacity>

        {/* 가운데: 단계 인디케이터 */}
        <View style={styles.center}>
          <StepIndicator total={total} current={current} />
        </View>

        {/* 우측: 선택적 버튼 */}
        {rightButton ? (
          <TouchableOpacity
            onPress={rightButton.onPress}
            disabled={rightButton.disabled}
            style={[
              styles.rightBtn,
              {
                paddingVertical: scaleHeight(6),
                paddingHorizontal: scaleWidth(12),
                borderRadius: 6,
                opacity: rightButton.disabled ? 0.5 : 1,
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={{
                fontSize: scaleFont(13),
                fontWeight: '600',
                color: '#2B2B2B',
              }}
            >
              {rightButton.label}
            </Text>
          </TouchableOpacity>
        ) : (
          // 기본: 우측 비워두되 최소 폭은 유지
          <View style={{ width: scaleWidth(40) }} />
        )}
      </View>

      <View
        style={[
          styles.separator,
          {
            height: scaleHeight(1),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideLeft: {
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  rightBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADADA',
    minWidth: 40, // 레이아웃 안정성
    alignItems: 'center',
  },
  separator: {
    backgroundColor: '#DADADA',
    marginHorizontal: 0,
  },
});
