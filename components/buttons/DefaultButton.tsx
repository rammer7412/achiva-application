// components/buttons/EditProfileButton.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = {
  size?: number;
  fontFamily?: string;
} & TouchableOpacityProps;

export function SmallButton({
  size = 18,
  fontFamily = 'Pretendard-ExtraBold',
  ...touchableProps
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      {...touchableProps}
      style={[
        styles.button,
        {
          paddingHorizontal: scaleWidth(16),
          paddingVertical: scaleHeight(8),
          borderRadius: scaleHeight(6),
        },
      ]}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: scaleFont(size),
          fontFamily,
        }}
      >
        프로필 수정
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#412A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
