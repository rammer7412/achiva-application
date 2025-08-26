import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

type Props = {
  color?: string;
};

export default function ACHIVALogo({ color = '#FFF' }: Props) {
  const { scaleFont } = useResponsiveSize();

  return <Text style={[styles.logo, { color, fontSize: scaleFont(50) }]}>{'ACHIVA'}</Text>;
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'Pretendard-Variable',
    fontWeight: 'bold',
  } as TextStyle,
});
