import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
};

export default function ScreenContainer({ children }: Props) {
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

const styles = StyleSheet.create({
  safeareaContainer: {
    flex: 1,
    backgroundColor: 'black', // 또는 필요하면 '#412A2A'
  },
});
