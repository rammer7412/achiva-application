import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  index: number; // 0-based
  total: number;
};

export default function FixedPageBadge({ index, total }: Props) {
  const { scaleWidth, scaleHeight, scaleFont, smartScale } = useResponsiveSize();

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: scaleHeight(12),
        right: scaleWidth(12),
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: smartScale(20, 20),
        paddingHorizontal: scaleWidth(10),
        paddingVertical: scaleHeight(5),
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontFamily: 'Pretendard-SemiBold',
          fontSize: scaleFont(15),
        }}
      >
        {index + 1}/{total}
      </Text>
    </View>
  );
}
