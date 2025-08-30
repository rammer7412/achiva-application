import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Text, View } from 'react-native';

type Props = { points: number };

export default function SupportPointsSummary({ points }: Props) {
  const { scaleFont, scaleHeight } = useResponsiveSize();

  return (
    <PaddingContainer>
      <View style={{ marginTop: scaleHeight(6), marginBottom: scaleHeight(16) }}>
        <Text style={{ color: '#412A2A', fontFamily: 'Pretendard-Variable', fontWeight: '800', fontSize: scaleFont(36) }}>
          {points}
        </Text>
      </View>
    </PaddingContainer>
  );
}
