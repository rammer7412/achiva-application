import XIcon from '@/components/icons/XIcon';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  onPressClose?: () => void; // ← 추가
};

export function XHeader({ onPressClose }: Props) {
  const { scaleHeight, scaleWidth } = useResponsiveSize();
  const hit = {
    top: scaleHeight(6),
    bottom: scaleHeight(6),
    left: scaleWidth(6),
    right: scaleWidth(6),
  };

  return (
    <View
      style={{
        marginTop: scaleHeight(48),
      }}
    >
      <TouchableOpacity
        onPress={onPressClose}
        hitSlop={hit}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="닫기"
      >
        <XIcon focused={false} />
      </TouchableOpacity>
    </View>
  );
}
