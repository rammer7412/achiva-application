import { ScreenContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { scaleHeight } = useResponsiveSize();

  return (
    <ScreenContainer>
      <View
        style={[
          styles.container,
          {
            paddingTop: scaleHeight(24),
          },
        ]}
      >
        <Text>개발 예정 구역</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
});
