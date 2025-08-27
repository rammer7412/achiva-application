import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
};

type ScrollContainerProps = {
  children: ReactNode;
  onScroll?: (e: any) => void;
  scrollEventThrottle?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
};

export function ScreenContainer({ children }: Props) {
  return (
    <SafeAreaView
      mode="padding"
      style={styles.safeareaContainer}
      edges={['top']}
    >
      {children}
    </SafeAreaView>
  );
}

export function ScrollContainer({ children }: ScrollContainerProps) {
  return (
    <SafeAreaView
      style={styles.safeareaContainer}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>    
  );
}

export function PaddingContainer({ children }: Props){
  const { scaleWidth } = useResponsiveSize();
  return (
  <View
    style={{paddingHorizontal: scaleWidth(20), backgroundColor: '#d1d2b9ff'}}>
    {children}
  </View>
  )
}

const styles = StyleSheet.create({
  safeareaContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    flexGrow: 1, // ScrollView가 남는 공간을 다 채우게
    backgroundColor: '#fff',
  },
});
