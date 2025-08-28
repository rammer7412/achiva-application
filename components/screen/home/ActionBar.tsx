import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

type Props = {
  actions?: string[];
  style?: ViewStyle;
  /** 버튼을 누를 때 호출 (label, isOn) */
  onPressAction?: (label: string, isOn: boolean) => void;
  /** 초깃값으로 켜둘 버튼 목록(없으면 모두 꺼짐) */
  initialSelected?: string[];
};

export default function ActionBar({
  actions = ['최고예요', '수고했어요', '응원해요', '동기부여'],
  style,
  onPressAction,
  initialSelected = [], // 기본: 전부 꺼짐
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont, smartScale } = useResponsiveSize();

  // 다중 선택을 위한 Set
  const [selectedSet, setSelectedSet] = React.useState<Set<string>>(
    () => new Set(initialSelected),
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: scaleWidth(8),
        },
        btnBase: {
          paddingVertical: scaleHeight(12),
          paddingHorizontal: scaleWidth(18),
          borderRadius: 36,
          borderWidth: scaleWidth(2),
        },
        btnOn: {
          backgroundColor: '#412A2A',
          borderColor: '#412A2A',
        },
        btnOff: {
          backgroundColor: '#FFFFFF',
          borderColor: '#412A2A',
        },
        textOn: {
          color: '#FFFFFF',
          fontSize: scaleFont(15),
          fontFamily: 'Pretendard-ExtraBold',
        },
        textOff: {
          color: '#412A2A',
          fontSize: scaleFont(15),
          fontFamily: 'Pretendard-ExtraBold',
        },
      }),
    [scaleWidth, scaleHeight, scaleFont, smartScale],
  );

  const hit = {
    top: scaleHeight(6),
    bottom: scaleHeight(6),
    left: scaleWidth(6),
    right: scaleWidth(6),
  };

  const toggle = (label: string) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label); // 다시 누르면 꺼짐
        onPressAction?.(label, false);
      } else {
        next.add(label); // 여러 개 켤 수 있음
        onPressAction?.(label, true);
      }
      return next;
    });
  };

  return (
    <PaddingContainer>
      <View style={[styles.container, style]}>
        {actions.map((label) => {
          const isOn = selectedSet.has(label);
          return (
            <TouchableOpacity
              key={label}
              style={[styles.btnBase, isOn ? styles.btnOn : styles.btnOff]}
              activeOpacity={0.85}
              hitSlop={hit}
              onPress={() => toggle(label)}
            >
              <Text style={isOn ? styles.textOn : styles.textOff}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </PaddingContainer>
  );
}
