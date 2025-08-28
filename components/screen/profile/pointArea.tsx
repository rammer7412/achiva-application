import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { BronzeBadge, SilverBadge } from '@/components/icons/Badge';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import SupportHistorySheet from './SupportHistorySheet';

type Tone = 'silver' | 'bronze';

type PointBoxProps = {
  title?: string;
  tone?: Tone;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
};

export function PointBox({
  title = '받은 응원 기록',
  tone = 'silver',
  style,
  onPress,
  disabled,
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
      ? { pillBg: '#E5E8EC', pillText: '#6B7380', ripple: 'rgba(107,115,128,0.12)' }
      : { pillBg: '#F2EEE3', pillText: '#8A7A5D', ripple: 'rgba(138,122,93,0.12)' };

  return (
    <View
      style={[
        styles.cardShadow,
        { borderRadius: CARD_RADIUS },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        android_ripple={{ color: palette.ripple }}
        style={({ pressed }) => ([
          styles.cardInner,
          {
            borderRadius: CARD_RADIUS,
            paddingVertical: scaleHeight(22),
            paddingHorizontal: scaleWidth(22),
            opacity: pressed ? 0.98 : 1,
          },
        ])}
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
      </Pressable>
    </View>
  );
}

export function PointArea() {
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const [sheetOpen, setSheetOpen] = React.useState<false | 'received' | 'sent'>(false);

  const GAP = scaleWidth(14);
  const CARD_HEIGHT = scaleHeight(185);

  // (예시) 두 케이스 분리 데이터 — 추후 API 연결
  const receivedTotal = 90;
  const receivedStats = [
    { label: '최고예요 👍', points: 30 },
    { label: '응원해요 🔥', points: 20 },
    { label: '수고했어요 💕', points: 20 },
    { label: '동기부여 🍀', points: 20 },
  ];

  const sentTotal = 42;
  const sentStats = [
    { label: '최고예요 👍', points: 12 },
    { label: '응원해요 🔥', points: 10 },
    { label: '수고했어요 💕', points: 10 },
    { label: '동기부여 🍀', points: 10 },
  ];

  return (
    <PaddingContainer>
      <View style={[styles.row, { gap: GAP, marginBottom: scaleHeight(24) }]}>
        <View style={styles.col}>
          <PointBox
            title="받은 응원 기록"
            tone="silver"
            style={{ height: CARD_HEIGHT }}
            onPress={() => setSheetOpen('received')}
          />
        </View>
        <View style={styles.col}>
          <PointBox
            title="보낸 응원 기록"
            tone="bronze"
            style={{ height: CARD_HEIGHT }}
            onPress={() => setSheetOpen('sent')}
          />
        </View>
      </View>

      <SupportHistorySheet
        visible={!!sheetOpen}
        onClose={() => setSheetOpen(false)}
        userName="Achiva_123"
        variant={sheetOpen === 'sent' ? 'sent' : 'received'}                // ⬅️ 분기
        totalPoints={sheetOpen === 'sent' ? sentTotal : receivedTotal}      // ⬅️ 분기
        buttonStats={sheetOpen === 'sent' ? sentStats : receivedStats}      // ⬅️ 분기
      />
    </PaddingContainer>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardInner: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  pill: { alignSelf: 'center' },
  pillText: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
});
