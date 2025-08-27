import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

type Props = {
  size?: number;
  color?: string;
  text?: string;
  numberOfLines?: number;
  style?: TextStyle | TextStyle[];
  /** 말줄임 위치. default: 'tail' */
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  children?: React.ReactNode;
  /** 사용할 폰트 패밀리. default: 'Pretendard-Variable' */
  fontFamily?: string;
};

export function SimpleText({
  size = 16,
  color = '#111',
  text,
  numberOfLines = 3,
  style,
  ellipsizeMode = 'tail',
  children,
  fontFamily = 'Pretendard-Thin',
}: Props) {
  const { scaleFont } = useResponsiveSize();
  const content = children ?? text ?? '';

  return (
    <Text
      style={[
        styles.base,
        { fontSize: scaleFont(size), color, fontFamily },
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {content}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    // 기본 스타일만 유지 (fontFamily는 props로 주입)
  },
});
