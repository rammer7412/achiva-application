import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  text: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function SmallButton({
  text,
  selected = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: Props) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const BG_SELECTED = '#442727';
  const BG_DEFAULT = '#FFFFFF';
  const TEXT_SELECTED = '#FFFFFF';
  const TEXT_DEFAULT = '#442727';
  const BORDER = '#888888';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          paddingVertical: scaleHeight(7),
          paddingHorizontal: scaleWidth(19),
          backgroundColor: selected ? BG_SELECTED : BG_DEFAULT,
          borderColor: BORDER,
          borderWidth: 1,
          borderRadius: scaleWidth(4),
          marginBottom: scaleHeight(12),
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leftIcon ? <View style={{ marginRight: scaleWidth(6) }}>{leftIcon}</View> : null}
        <Text
          style={[
            {
              color: selected ? TEXT_SELECTED : TEXT_DEFAULT,
              fontSize: scaleWidth(20),
              fontWeight: '500',
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
        {rightIcon ? <View style={{ marginLeft: scaleWidth(6) }}>{rightIcon}</View> : null}
      </View>
    </TouchableOpacity>
  );
}
