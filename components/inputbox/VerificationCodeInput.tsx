import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { useRef } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

type Props = {
  code: string;
  setCode: (code: string) => void;
  length?: number;
};

export default function VerificationCodeInput({
  code,
  setCode,
  length = 6,
}: Props) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  const containerWidth = scaleWidth(382);
  const spacing = scaleWidth(8);
  const totalSpacing = spacing * (length - 1);
  const inputWidth = (containerWidth - totalSpacing) / length;

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = code.split('');
    newCode[index] = text;
    const updated = newCode.join('');
    setCode(updated);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updated.length === length) Keyboard.dismiss();
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newCode = code.split('');

      if (code[index]) {
        newCode[index] = '';
        setCode(newCode.join(''));
      } else if (index > 0) {
        newCode[index - 1] = '';
        setCode(newCode.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: containerWidth,
          height: scaleHeight(136),
        },
      ]}
    >
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          style={[
            styles.inputBox,
            {
              width: inputWidth,
              height: scaleHeight(136),
              fontSize: scaleFont(48),
              fontFamily: 'Pretendard-Variable',
              marginRight: i !== length - 1 ? spacing : 0,
            },
          ]}
          value={code[i] || ''}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          ref={(ref) => {
            inputRefs.current[i] = ref;
          }}
          textAlign="center"
          selectionColor="#412A2A"
          placeholderTextColor="#ccc"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#412A2A',
    borderRadius: 8,
    backgroundColor: '#FFF',
    color: '#000',
  },
});
