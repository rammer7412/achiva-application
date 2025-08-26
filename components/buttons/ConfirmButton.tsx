import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
};

export default function ConfirmButton({
  text,
  onPress,
  disabled = false,
  backgroundColor,
  textColor,
}: Props) {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();

  const buttonStyle: ViewStyle = {
    height: scaleHeight(50),
    borderRadius: scaleWidth(5),
  };

  const textStyle: TextStyle = {
    fontSize: scaleFont(19),
  };

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
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      <Text
        style={[
          styles.buttonText,
          textStyle,
          { color: disabled ? '#888888' : textColor || '#FFFFFF' },
        ]}
      >
        {text}
      </Text>
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
});
