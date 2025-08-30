import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Text } from 'react-native';

export default function SupportSectionTitle({ children }: { children: React.ReactNode }) {
  const { scaleFont, } = useResponsiveSize();
  return (
    <PaddingContainer>
      <Text style={{ color: 'rgba(65, 42, 42, 0.70)', fontFamily: 'Pretendard-ExtraBold', fontSize: scaleFont(24) }}>
        {children}
      </Text>
    </PaddingContainer>
  );
}
