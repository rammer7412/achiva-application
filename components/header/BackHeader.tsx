import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import CaretLeft from '../icons/CaretLeftIcon';

type Props = {
  onPressBack?: () => void;
};

export function BackHeader({ onPressBack }: Props) {
  const { scaleHeight, scaleWidth } = useResponsiveSize();
  const router = useRouter();

  const hit = {
    top: scaleHeight(6),
    bottom: scaleHeight(6),
    left: scaleWidth(6),
    right: scaleWidth(6),
  };

  const handlePress = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={{
        marginTop: scaleHeight(48),
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        hitSlop={hit}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
      >
        <CaretLeft />
      </TouchableOpacity>
    </View>
  );
}
