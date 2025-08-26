// @/components/InputBox/PasswordInput.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

type PasswordInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  subtext?: string;
  backgroundColor?: string;

  // ✨ 추가: 인라인 에러
  hasError?: boolean;
  errorMessage?: string;

  // ✨ 추가: 입력 동작 관련(옵션)
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  textContentType?: TextInputProps['textContentType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChangeText,
  subtext,
  backgroundColor = '#F5F5F5',

  // 추가된 옵션
  hasError = false,
  errorMessage,
  returnKeyType = 'done',
  onSubmitEditing,
  textContentType = 'password',
  autoCapitalize = 'none',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { scaleFont, scaleHeight, scaleWidth } = useResponsiveSize();

  const borderColor = hasError ? '#B00020' : '#DDD';

  return (
    <View style={{ marginBottom: scaleHeight(8) }}>
      {label && (
        <Text
          style={{
            fontSize: scaleFont(13),
            color: '#808080',
            marginBottom: scaleHeight(8),
            fontFamily: 'Pretendard-ExtraBold',
          }}
        >
          {label}
        </Text>
      )}

      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <TextInput
          style={{
            height: scaleHeight(58),
            fontSize: scaleFont(16),
            borderRadius: scaleWidth(5),
            borderWidth: 1,
            borderColor,
            paddingHorizontal: scaleWidth(16),
            paddingRight: scaleWidth(40),
            backgroundColor,
            color: '#000',
          }}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />

        {value && value.length > 0 && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: scaleWidth(12),
              top: scaleHeight(14),
            }}
            onPress={() => setShowPassword((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={scaleWidth(20)}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 에러가 있으면 에러 우선, 없으면 하단 subtext 표시 */}
      {hasError && !!errorMessage ? (
        <Text
          style={{
            marginTop: scaleHeight(6),
            fontSize: scaleFont(12),
            color: '#B00020',
          }}
        >
          {errorMessage}
        </Text>
      ) : subtext ? (
        <Text
          style={{
            marginTop: scaleHeight(6),
            fontSize: scaleFont(12),
            color: '#808080',
          }}
        >
          {subtext}
        </Text>
      ) : null}
    </View>
  );
}
