// components/screen/profile/support/SupportButtonsCard.tsx
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { SupportButtonStat } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = { items: SupportButtonStat[] };

export default function SupportButtonsCard({ items }: Props) {
  const { scaleFont, scaleHeight} = useResponsiveSize();

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
            gap: scaleHeight(32),
            paddingVertical: scaleHeight(14),
          },
        ]}
      >
        {safeItems.map((it) => (
        <View key={it._key} style={[styles.row, { paddingVertical: scaleHeight(10) }]}>
          <Text style={{ fontSize: scaleFont(22), color: '#2B1E19', fontWeight: '800' }}>
            {it.label}
          </Text>
          <Text style={{ fontSize: scaleFont(18), color: '#6B6461', fontWeight: '700' }}>
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
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
