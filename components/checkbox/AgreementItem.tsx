// components/AgreementItem.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import CheckBox from './CheckBox';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
  showDetail?: boolean;
  onPressDetail?: () => void;
};

const BRAND_TEXT = '#1D1B1B';
const SUB_ICON = '#BEBBBB';

export default function AgreementItem({
  checked,
  onToggle,
  label,
  disabled = false,
  showDetail = false,
  onPressDetail,
}: Props) {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();

  return (
    <View
      style={{
        paddingVertical: scaleHeight(10),
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* 왼쪽: 전체 영역 탭 → 토글 */}
      <Pressable
        onPress={disabled ? undefined : onToggle}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        hitSlop={6}
      >
        <CheckBox checked={checked} onToggle={onToggle} disabled={disabled} />
        <Text
          style={{
            marginLeft: scaleWidth(10),
            fontSize: scaleFont(16),
            color: BRAND_TEXT,
            fontWeight: '600',
            fontFamily: 'Pretendard-Bold',
          }}
          numberOfLines={2}
        >
          {label}
        </Text>
      </Pressable>

      {/* 오른쪽: 상세 보기 화살표 */}
      {showDetail ? (
        <Pressable
          onPress={onPressDetail}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${label} 자세히 보기`}
        >
          <Ionicons name="chevron-forward" size={scaleWidth(18)} color={SUB_ICON} />
        </Pressable>
      ) : (
        <View style={{ width: scaleWidth(18) }} />
      )}
    </View>
  );
}
