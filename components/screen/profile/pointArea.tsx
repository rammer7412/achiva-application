import { fetchMemberProfile } from '@/api/member';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import SupportHistorySheetContainer from '@/components/containers/SupportHistorySheetContainer';
import { BronzeBadge, SilverBadge } from '@/components/icons/Badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

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
      ? { pillBg: '#E5E8EC', pillText: '#6B7380', ripple: 'rgba(42, 85, 155, 0.12)' }
      : { pillBg: '#F2EEE3', pillText: '#8A7A5D', ripple: 'rgba(138,122,93,0.12)' };

  return (
    <View style={[styles.cardShadow]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        android_ripple={{ color: palette.ripple }}
        style={({ pressed }) => [
          styles.cardInner,
          {
            borderRadius: CARD_RADIUS,
            paddingVertical: scaleHeight(22),
            paddingHorizontal: scaleWidth(22),
            opacity: pressed ? 0.98 : 1,
          },
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
      </Pressable>
    </View>
  );
}

type PointAreaProps = {
  isSelf?: boolean;
  memberId? : number;
};

export function PointArea({ isSelf = true, memberId }: PointAreaProps) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const [sheetOpen, setSheetOpen] = React.useState<false | 'received' | 'sent'>(false);

  const selfUser = useAuthStore((s) => s.user);
  const [otherUserName, setOtherUserName] = useState<string>('');

  useEffect(() => {
    if (!isSelf && memberId) {
      (async () => {
        try {
          const res = await fetchMemberProfile(memberId);
          setOtherUserName(res.nickName ?? '');
        } catch (e) {
          if (__DEV__) console.log('[PointArea] fetch failed:', e);
        }
      })();
    }
  }, [isSelf, memberId]);

  const userName = isSelf ? selfUser?.nickName ?? '' : otherUserName;

  const GAP = scaleWidth(14);
  const CARD_HEIGHT = scaleHeight(185);

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

      <SupportHistorySheetContainer
        visible={!!sheetOpen}
        onClose={() => setSheetOpen(false)}
        userName={userName}
        variant={sheetOpen === 'sent' ? 'sent' : 'received'}
        memberId={memberId}
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
    borderWidth: 2,
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
  backgroundColor: 'transparent',
}
});
