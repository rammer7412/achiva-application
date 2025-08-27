import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

type Props = {
  label: string;
  selected?: boolean;        // 선택 상태(색 반전)
  disabled?: boolean;
  onPress?: () => void;      // 없으면 단순 표시용
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function CategoryChip({
  label,
  selected = false,
  disabled = false,
  onPress,
  style,
  textStyle,
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  // md 고정
  const paddings = {
    px: scaleWidth(18),
    py: scaleHeight(12),
    fs: scaleFont(16),
    radius: 6,
  };

  const colors = {
    baseBg: 'rgba(65, 42, 42, 0.15)', // 칩 배경 (스샷 톤)
    baseFg: '#412A2A',                // 텍스트/아이콘
    selBg:  '#412A2A',                // 선택 배경
    selFg:  '#FFFFFF',                // 선택 텍스트
    dimFg:  'rgba(68,39,39,0.5)',
  };

  const bg = selected ? colors.selBg : colors.baseBg;
  const fg = selected ? colors.selFg : (disabled ? colors.dimFg : colors.baseFg);

  return (
    <Pressable
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          paddingHorizontal: paddings.px,
          paddingVertical: paddings.py,
          borderRadius: paddings.radius,
          alignSelf: 'flex-start',
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ disabled, selected }}
    >
      <Text
        style={[
          {
            color: fg,
            fontSize: paddings.fs,
            fontFamily: 'Pretendard-ExtraBold',
            includeFontPadding: false,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
