import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  total: number;
  current: number;
};

export default function StepIndicator({ total, current }: Props) {
  const { smartScale } = useResponsiveSize();
  const dotSize = smartScale(12, 16);
  const dotGap = smartScale(12, 28);
  const borderWidth = smartScale(1, 2);
  const primaryColor = '#4B2E2E';

  return (
    <View style={[styles.container, { gap: dotGap }]}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              borderWidth,
              borderColor: primaryColor,
            },
            index + 1 === current ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    backgroundColor: '#4B2E2E',
  },
  inactiveDot: {
    backgroundColor: '#FFFFFF',
  },
});
