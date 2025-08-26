import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';

type SignupButtonProps = {
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function SignupButton({ text, onPress }: SignupButtonProps) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          height: scaleHeight(58),
          paddingVertical: scaleHeight(10),
          paddingHorizontal: scaleWidth(93),
          borderRadius: scaleWidth(5),
          marginBottom: scaleHeight(12),
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: scaleFont(19),
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'auto',
  },
  text: {
    fontFamily: 'Pretendard-ExtraBold',
    color: '#412A2A',
  },
});
