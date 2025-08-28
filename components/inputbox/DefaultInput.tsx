// @/components/InputBox/DefaultInput.tsx
import PencilSimple from '@/components/icons/PencilSimple';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { memo, useEffect, useRef } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  value?: string;
  placeholder?: string;

  editable?: boolean;
  onChangeText?: (text: string) => void;

  onPress?: () => void;       // 전체 박스 탭
  onPressEdit?: () => void;   // 우측 아이콘 탭

  disabled?: boolean;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  inputProps?: TextInputProps;

  rightIcon?: React.ReactNode; // 전달 시 이 아이콘 사용
  showRightIcon?: boolean;     // 기본 true

  autoFocusOnEdit?: boolean;   // 편집 모드 진입 시 포커스 (기본 true)
  placeCursorAtEnd?: boolean;  // 포커스 시 커서를 끝으로 (기본 true)
};

function DefaultInput({
  value,
  placeholder,
  editable = false,
  onChangeText,
  onPress,
  onPressEdit,
  disabled = false,
  style,
  textStyle,
  inputProps,
  rightIcon,
  showRightIcon = true,
  autoFocusOnEdit = true,
  placeCursorAtEnd = true,
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const inputRef = useRef<TextInput>(null);

  // 편집 모드 진입 시 자동 포커스 + 커서 끝으로
  useEffect(() => {
    if (editable && autoFocusOnEdit) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        if (placeCursorAtEnd) {
          const len = value?.length ?? 0;
          // @ts-ignore: RN setNativeProps selection
          inputRef.current?.setNativeProps?.({ selection: { start: len, end: len } });
        }
      });
    }
  }, [editable, autoFocusOnEdit, placeCursorAtEnd, value]);

  // ===== Responsive sizes =====
  const containerHeight = Math.max(scaleHeight(56), 48);
  const paddingX = scaleWidth(16);
  const paddingY = Math.max(scaleHeight(12), 10);
  const radius = Math.max(scaleWidth(6), 10);

  const rightBox = Math.max(scaleWidth(40), 36); // 우측 아이콘 영역
  const fontSize = scaleFont(15);

  const Container = (
    <View
      style={[
        styles.container,
        {
          minHeight: containerHeight,
          paddingLeft: paddingX,
          paddingRight: rightBox,
          paddingVertical: paddingY,
          borderRadius: radius,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {editable ? (
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9C9C9C"
          style={[
            styles.input,
            { fontSize, fontFamily: 'Pretendard-Variable' },
            textStyle,
          ]}
          editable={!disabled}
          selectionColor="#412A2A"
          {...inputProps}
        />
      ) : (
        <Text
          numberOfLines={1}
          style={[
            styles.valueText,
            {
              fontSize,
              color: value ? '#222' : '#9C9C9C',
              fontFamily: 'Pretendard-Variable',
            },
            textStyle,
          ]}
        >
          {value && value.length > 0 ? value : placeholder ?? ''}
        </Text>
      )}

      {/* Right icon (absolute) */}
      {showRightIcon && (rightIcon ?? true) ? (
        <Pressable
          disabled={!onPressEdit || disabled}
          onPress={onPressEdit}
          hitSlop={8}
          style={[styles.rightIconBox, { width: rightBox }]}
        >
          {rightIcon ?? <PencilSimple focused={!disabled} />}
        </Pressable>
      ) : null}
    </View>
  );

  // 읽기 모드에서만 전체 박스 탭 가능
  if (onPress && !editable) {
    return (
      <Pressable onPress={disabled ? undefined : onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
        {Container}
      </Pressable>
    );
  }
  return Container;
}

export default memo(DefaultInput);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
  },
  valueText: { color: '#222' },
  input: { padding: 0, margin: 0, color: '#222' },
  rightIconBox: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
});
