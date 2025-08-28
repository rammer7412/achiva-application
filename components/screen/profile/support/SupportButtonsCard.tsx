// components/screen/profile/support/SupportButtonsCard.tsx
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type ButtonStat = { label: string; points: number };

type Props = { items: ButtonStat[] };

export default function SupportButtonsCard({ items }: Props) {
  const { scaleFont, scaleHeight, smartScale, scaleWidth } = useResponsiveSize();

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
        {items.map((it, i) => (
          
          <View key={i} style={[styles.row, {marginHorizontal: scaleWidth(18),paddingVertical: scaleHeight(24) }]}>
            <Text style={{ fontFamily: 'Pretendard-Variable', fontSize: scaleFont(18), color: '#2B1E19', fontWeight: '800' }}>
              {it.label}
            </Text>
            <Text style={{ fontFamily: 'Pretendard-Variable', fontSize: scaleFont(15), color: '#6B6461', fontWeight: '700' }}>
              {it.points} points
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
