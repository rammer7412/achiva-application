import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

type LogoProps = {
  text: string;
};

export default function SubtitleText({ text }: LogoProps) {
  const { scaleFont, scaleHeight } = useResponsiveSize();

  return (
    <Text style={[styles.textStyle, {
      fontSize: scaleFont(24),
      marginTop: scaleHeight(6),
    }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Pretendard-Thin',
    fontWeight: 'normal',
    color: '#FFF',
    textAlign: 'center',
  },
});
