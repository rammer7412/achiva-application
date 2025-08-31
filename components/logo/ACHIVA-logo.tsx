import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';

type Props = {
  /** 로고 색상은 이미지라 필요없음 */
  width?: number;
  height?: number;
};

export default function ACHIVALogo({ width = 200, height = 80 }: Props) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  return (
    <Image
      source={require('@/assets/images/achiva-logo.png')}
      style={[styles.logo, { width: scaleWidth(width), height: scaleHeight(height) }]}
      resizeMode="contain"
    />
  );
}

export function ACHIVALogoWhite({ width = 200, height = 80 }: Props) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  return (
    <Image
      source={require('@/assets/images/achiva-logo-white.png')}
      style={[styles.logo, { width: scaleWidth(width), height: scaleHeight(height) }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
  } as ImageStyle,
});
