import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { BronzeBadge, SilverBadge } from '@/components/icons/Badge';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type Tone = 'silver' | 'bronze';

type PointBoxProps = {
  title?: string;
  tone?: Tone;
  style?: ViewStyle; // 부모에서 높이/여백 제어할 수 있도록
};

export function PointBox({
  title = '받은 응원 기록',
  tone = 'silver',
  style,
}: PointBoxProps) {
  const { scaleWidth, scaleHeight, scaleFont, smartScale } = useResponsiveSize();

  const CARD_RADIUS = smartScale(14, 18);
  const BADGE_SIZE = smartScale(44, 60);
  const GAP = scaleHeight(12);

  const PILL_RADIUS = smartScale(14, 18);
  const PILL_PAD_V = scaleHeight(8);
  const PILL_PAD_H = scaleWidth(16);
  const PILL_FONT = scaleFont(16);

  const palette =
    tone === 'silver'
      ? {
          pillBg: '#E5E8EC',
          pillText: '#6B7380',
        }
      : {
          pillBg: '#F2EEE3',
          pillText: '#8A7A5D',
        };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: CARD_RADIUS,
          paddingVertical: scaleHeight(22),
          paddingHorizontal: scaleWidth(22),
        },
        style,
      ]}
    >
      <View style={{ alignItems: 'center', gap: GAP }}>
        {tone === 'bronze' ? (
          <BronzeBadge size={BADGE_SIZE} />
        ) : (
          <SilverBadge size={BADGE_SIZE} />
        )}

        <View
          style={[
            styles.pill,
            {
              borderRadius: PILL_RADIUS,
              paddingVertical: PILL_PAD_V,
              paddingHorizontal: PILL_PAD_H,
              backgroundColor: palette.pillBg,
            },
          ]}
        >
          <Text
            style={[
              styles.pillText,
              { fontSize: PILL_FONT, color: palette.pillText },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function PointArea() {
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const GAP = scaleWidth(14);
  const CARD_HEIGHT = scaleHeight(185); // 원하는 카드 높이

  return (
    <PaddingContainer>
      <View style={[styles.row, { gap: GAP, marginBottom: scaleHeight(30) }]}>
        <View style={styles.col}>
          <PointBox
            title="받은 응원 기록"
            tone="silver"
            style={{ height: CARD_HEIGHT }}
          />
        </View>
        <View style={styles.col}>
          <PointBox
            title="보낸 응원 기록"
            tone="bronze"
            style={{ height: CARD_HEIGHT }}
          />
        </View>
      </View>
    </PaddingContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  pill: {
    alignSelf: 'center',
  },
  pillText: {
    textAlign: 'center',
    fontWeight: '700',
    // fontFamily: 'Pretendard-ExtraBold',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1, // 두 카드 동일 너비
  },
});
