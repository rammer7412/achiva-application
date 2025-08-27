// components/CheckBox.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  checked: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  size?: Size; // 기본 md
};

const BRAND = '#442727';

// ⬇️ Unchecked 상태의 톤(참고 이미지 맞춤)
const UNCHECK_BG = '#F5F3F2';
const UNCHECK_BORDER = '#CFCAC8';
const UNCHECK_CHECK = '#BDB6B3';

export default function CheckBox({
  checked,
  onToggle,
  disabled = false,
  size = 'md',
}: Props) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const boxSize =
    size === 'lg'
      ? Math.min(scaleWidth(28), scaleHeight(28))
      : size === 'sm'
      ? Math.min(scaleWidth(20), scaleHeight(20))
      : Math.min(scaleWidth(24), scaleHeight(24));

  return (
    <Pressable
      onPress={disabled ? undefined : onToggle}
      hitSlop={8}
      style={{
        width: boxSize,
        height: boxSize,
        borderRadius: 2,
        borderWidth: 2, // 이미지처럼 조금 두껍게
        borderColor: checked ? BRAND : UNCHECK_BORDER,
        backgroundColor: checked ? BRAND : UNCHECK_BG,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.7 : 1,
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      {/* 항상 체크 아이콘 렌더링: unchecked일 때 옅은 회색 */}
      <Feather
        name="check"
        size={boxSize * 0.75}
        color={checked ? '#FFFFFF' : UNCHECK_CHECK}
      />
    </Pressable>
  );
}
