import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

type LabeledInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  rightButtonText?: string;
  onPressRightButton?: () => void;
  rightButtonDisabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  subtext?: string;
  hasError?: boolean;
  errorMessage?: string;
};

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChangeText,
  rightButtonText,
  onPressRightButton,
  rightButtonDisabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  subtext,
  hasError = false,
  errorMessage,
}: LabeledInputProps) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  return (
    <View style={{ marginBottom: scaleHeight(24) }}>
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

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{
            flex: 1,
            height: scaleHeight(58),
            fontSize: scaleFont(16),
            borderRadius: scaleWidth(5),
            borderWidth: 1,
            borderColor: hasError ? '#E54545' : '#DDD',
            paddingHorizontal: scaleWidth(16),
            backgroundColor: hasError ? '#FDECEC' : '#F5F5F5',
            color: '#000',
            marginRight: rightButtonText ? scaleWidth(8) : 0,
          }}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />

        {rightButtonText && (
          <TouchableOpacity
            style={{
              height: scaleHeight(58),
              paddingHorizontal: scaleWidth(24),
              backgroundColor: rightButtonDisabled ? '#CCCCCC' : '#442727',
              borderRadius: scaleWidth(5),
              justifyContent: 'center',
            }}
            onPress={onPressRightButton}
            disabled={rightButtonDisabled}
            activeOpacity={rightButtonDisabled ? 1 : 0.8}
          >
            <Text
              style={{
                fontSize: scaleFont(14),
                fontWeight: 'bold',
                color: rightButtonDisabled ? '#888888' : '#FFFFFF',
              }}
            >
              {rightButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {hasError && errorMessage ? (
        <Text
          style={{
            marginTop: scaleHeight(6),
            fontSize: scaleFont(12),
            color: '#E54545',
          }}
        >
          {errorMessage}
        </Text>
      ) : (
        subtext && (
          <Text
            style={{
              marginTop: scaleHeight(6),
              fontSize: scaleFont(12),
              color: '#808080',
            }}
          >
            {subtext}
          </Text>
        )
      )}
    </View>
  );
}
