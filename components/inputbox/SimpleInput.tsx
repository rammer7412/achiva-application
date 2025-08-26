import { useResponsiveSize } from '@/utils/ResponsiveSize';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

type SimpleInputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  hasError?: boolean;
  errorMessage?: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  textContentType?: TextInputProps['textContentType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  multiline?: boolean;
  numberOfLines?: number;
  onBlur?: TextInputProps['onBlur'];
};

export default function SimpleInputBox({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  hasError = false,
  errorMessage,
  autoCapitalize = 'none',
  textContentType,
  returnKeyType = 'done',
  onSubmitEditing,

  multiline = false,
  numberOfLines,
  onBlur,
}: SimpleInputProps) {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();

  const borderColor = hasError ? '#B00020' : '#DDD';

  return (
    <View style={{ marginBottom: scaleHeight(4) }}>
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <TextInput
          style={{
            height: multiline ? undefined : scaleHeight(58),
            minHeight: multiline ? scaleHeight(96) : undefined,
            borderRadius: scaleWidth(6),
            borderWidth: 1,
            borderColor,
            paddingHorizontal: scaleWidth(16),
            paddingRight: scaleWidth(36),
            paddingVertical: multiline ? scaleHeight(12) : undefined,
            backgroundColor: '#fff',
            color: '#000',
            fontSize: scaleFont(16),
            fontFamily: 'Pretendard-Regular',
          }}
          placeholder={placeholder}
          placeholderTextColor="#B3B3B3"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          onBlur={onBlur}
        />

        {value && value.length > 0 && onChangeText && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: scaleWidth(10),
              top: scaleHeight(16),
            }}
            onPress={() => onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel="입력 내용 지우기"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AntDesign name="closecircleo" size={scaleWidth(16)} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {hasError && !!errorMessage && (
        <Text
          style={{
            marginTop: scaleHeight(6),
            color: '#B00020',
            fontSize: scaleFont(12),
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
