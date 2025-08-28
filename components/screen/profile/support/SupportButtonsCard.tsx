// components/screen/profile/support/SupportButtonsCard.tsx
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { CategoryKey } from '@/hooks/useSupportStats';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type ButtonStat = { key: CategoryKey; label: string; points: number; count: number };

type Props = { items: ButtonStat[] };

export default function SupportButtonsCard({ items }: Props) {
  const { scaleFont, scaleHeight, smartScale, scaleWidth } = useResponsiveSize();

  const seen = new Set<string>();
  const safeItems = items.map((it, i) => {
    const k = it?.key ?? `${it?.label ?? 'item'}-${i}`;
    let finalKey = String(k);
    if (seen.has(finalKey)) finalKey = `${finalKey}-${i}`;
    seen.add(finalKey);
    return { ...it, _key: finalKey };
  });

  return (
    <PaddingContainer>
      <View
        style={[
          styles.card,
          {
            borderRadius: smartScale(5, 5),
            paddingVertical: scaleHeight(10),
          },
        ]}
      >
        {safeItems.map((it) => (
        <View key={it._key} style={[styles.row, { paddingVertical: scaleHeight(10) }]}>
          <Text style={{ fontSize: scaleFont(16), color: '#2B1E19', fontWeight: '800' }}>
            {it.label}
          </Text>
          <Text style={{ fontSize: scaleFont(14), color: '#6B6461', fontWeight: '700' }}>
            {(it.points ?? 0)} points
          </Text>
        </View>
      ))}
      </View>
    </PaddingContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
