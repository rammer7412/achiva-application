// components/bars/ActionBar.tsx
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import CloverIcon from '@/components/icons/CloverIcon';
import FlameIcon from '@/components/icons/FlameIcon';
import HeartIcon from '@/components/icons/HeartIcon';
import ThumbIcon from '@/components/icons/ThumbIcon';

type Props = {
  actions?: string[];
  style?: ViewStyle;
  /** 버튼을 누를 때 호출 (label, isOn) */
  onPressAction?: (label: string, isOn: boolean) => void;
  /** 초깃값으로 켜둘 버튼 목록(없으면 모두 꺼짐) */
  initialSelected?: string[];
};

const ICON_BY_LABEL: Record<
  string,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  최고예요: ThumbIcon,
  수고했어요: FlameIcon,
  응원해요: HeartIcon,
  동기부여: CloverIcon,
};

export default function ActionBar({
  actions = ['최고예요', '수고했어요', '응원해요', '동기부여'],
  style,
  onPressAction,
  initialSelected = [],
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  const [selectedSet, setSelectedSet] = React.useState<Set<string>>(
    () => new Set(initialSelected),
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: scaleWidth(4),
        },
        btnBase: {
          paddingVertical: scaleHeight(8),
          paddingHorizontal: scaleWidth(10),
          borderRadius: 36,
          borderWidth: scaleWidth(1.2),
        },
        btnOn: {
          backgroundColor: '#412A2A',
          borderColor: '#412A2A',
        },
        btnOff: {
          backgroundColor: '#FFFFFF',
          borderColor: '#412A2A',
        },
        contentRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        textOn: {
          color: '#FFFFFF',
          fontSize: scaleFont(14),
          fontFamily: 'Pretendard-ExtraBold',
        },
        textOff: {
          color: '#412A2A',
          fontSize: scaleFont(14),
          fontFamily: 'Pretendard-ExtraBold',
        },
        iconSpacer: {
          marginLeft: scaleWidth(8),
        },
      }),
    [scaleWidth, scaleHeight, scaleFont],
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
        next.delete(label);
        onPressAction?.(label, false);
      } else {
        next.add(label);
        onPressAction?.(label, true);
      }
      return next;
    });
  };

  const ICON_SIZE = scaleWidth(8);

  return (
    <PaddingContainer>
      <View style={[styles.container, style]}>
        {actions.map((label) => {
          const isOn = selectedSet.has(label);
          const IconComp = ICON_BY_LABEL[label];
          const iconColor = isOn ? '#FFFFFF' : '#412A2A';

          return (
            <TouchableOpacity
              key={label}
              style={[styles.btnBase, isOn ? styles.btnOn : styles.btnOff]}
              activeOpacity={0.85}
              hitSlop={hit}
              onPress={() => toggle(label)}
            >
              <View style={styles.contentRow}>
                <Text style={isOn ? styles.textOn : styles.textOff}>{label}</Text>
                {IconComp ? (
                  <View style={styles.iconSpacer}>
                    <IconComp size={ICON_SIZE} color={iconColor} />
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </PaddingContainer>
  );
}
