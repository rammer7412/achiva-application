import { ScreenContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
        {/* 여기서부터 메인 콘텐츠 작성 가능 */}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // 밝은 회색 배경
  },
});
