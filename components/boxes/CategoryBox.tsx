// @/components/InputBox/CategoryBox.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  editable?: boolean;

  onPress?: () => void;
  onToggle?: (next: boolean) => void;
  onLongPress?: () => void;
  onRemove?: () => void;

  size?: Size;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default memo(function CategoryBox({
  label,
  selected = false,
  disabled = false,
  editable = false,
  onPress,
  onToggle,
  onLongPress,
  onRemove,
  size = 'sm',
  leftIcon,
  style,
  textStyle,
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  const SIZES = {
    sm: { px: scaleWidth(10), py: Math.max(scaleHeight(6), 4), fs: scaleFont(12), radius: Math.max(scaleWidth(9999), 9999), minH: Math.max(scaleHeight(30), 28), gap: scaleWidth(6), icon: Math.max(scaleWidth(12), 11) },
    md: { px: scaleWidth(12), py: Math.max(scaleHeight(8), 6), fs: scaleFont(13), radius: Math.max(scaleWidth(9999), 9999), minH: Math.max(scaleHeight(34), 32), gap: scaleWidth(8), icon: Math.max(scaleWidth(14), 12) },
    lg: { px: scaleWidth(14), py: Math.max(scaleHeight(10), 8), fs: scaleFont(14), radius: Math.max(scaleWidth(9999), 9999), minH: Math.max(scaleHeight(38), 36), gap: scaleWidth(8), icon: Math.max(scaleWidth(16), 14) },
  }[size];

  const palette = {
    bg: '#FFFFFF',
    text: '#2B2B2B',
    textDim: '#8A8A8A',
    border: '#E6E6E6',
    primary: '#412A2A',
    white: '#FFFFFF',
  };

  const containerStyle: ViewStyle = {
    paddingHorizontal: SIZES.px,
    paddingVertical: SIZES.py,
    minHeight: SIZES.minH,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: selected ? palette.primary : palette.border,
    backgroundColor: selected ? palette.primary : palette.bg,
    alignSelf: 'flex-start',
    opacity: disabled ? 0.55 : 1,
  };

  const labelStyle: TextStyle = {
    fontSize: SIZES.fs,
    color: selected ? palette.white : palette.text,
    fontFamily: 'Pretendard-Variable',
  };

  // ✅ 요구사항 반영:
  // - 편집 모드가 아니면 토글 금지
  // - 편집 모드여도 이미 선택된 칩은 텍스트 탭으로 해제 불가(X로만 제거)
  const onBoxPress = () => {
    if (disabled) return;

    if (!editable) {
      onPress?.();
      return;
    }

    if (selected) {
      // 편집 모드 + 선택된 칩: 텍스트 누르면 아무 일도 하지 않음 (X로만 삭제)
      return;
    }

    // 편집 모드 + 미선택 칩(추천 목록 등): 탭하면 선택
    onToggle?.(true);
  };

  return (
    <Pressable
      onPress={onBoxPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }, style]}
      hitSlop={8}
    >
      <View style={[styles.inner, containerStyle]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {leftIcon ? <View style={{ marginRight: SIZES.gap }}>{leftIcon}</View> : null}

          <Text numberOfLines={1} style={[labelStyle, textStyle]}>
            {label}
          </Text>

          {/* 편집+선택일 때만 X 표시 → X로만 제거 */}
          {editable && selected ? (
            <Pressable
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
              style={{ marginLeft: SIZES.gap }}
            >
              <Ionicons
                name="close"
                size={SIZES.icon}
                color={selected ? palette.white : palette.textDim}
              />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  inner: {},
});
