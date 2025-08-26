import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: TextStyle;
};

export function ThinText({ children, style }: Props) {
  const { scaleFont } = useResponsiveSize();

  return (
    <Text style={[styles.text, { fontSize: scaleFont(16), fontFamily: 'Pretendard-Thin' }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Pretendard-Thin',
  },
});
