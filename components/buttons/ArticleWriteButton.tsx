// components/buttons/ConfirmButton.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  /** 아이콘 노드. 없으면 아이콘 없음 */
  icon?: React.ReactNode;
  /** 아이콘 위치. 기본: 'right' */
  iconPosition?: 'left' | 'right';
};

export default function ConfirmButton({
  text,
  onPress,
  disabled = false,
  backgroundColor,
  textColor,
  icon,
  iconPosition = 'right',
}: Props) {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();

  const buttonStyle: ViewStyle = {
    height: scaleHeight(50),
    borderRadius: scaleWidth(4),        // 둥글게
    paddingHorizontal: scaleWidth(16),   // 좌우 기본 패딩
  };

  const textStyle: TextStyle = {
    fontSize: scaleFont(19),
    color: disabled ? '#888888' : textColor || '#FFFFFF',
    fontFamily: 'Pretendard-ExtraBold',
  };

  // 아이콘 컨테이너: 절대배치로 텍스트 중앙 고정
  const iconSideStyle =
    iconPosition === 'right' ? { right: scaleWidth(32) } : { left: scaleWidth(32) };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        { backgroundColor: disabled ? '#CCCCCC' : backgroundColor || '#442727' },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
      accessible
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      {/* 중앙 텍스트 */}
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>

      {/* 선택 아이콘 */}
      {icon ? (
        <View style={[styles.iconWrap, iconSideStyle]} pointerEvents="none">
          {icon}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '500',
  },
  iconWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
