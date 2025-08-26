import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
};

export default function HeaderWithBack({ title }: Props) {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont, safeArea } = useResponsiveSize();

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: safeArea.top + scaleHeight(10),
          paddingTop: scaleHeight(30),
        },
      ]}
    >
      <View
        style={[
          styles.headerRow,
          {
            paddingHorizontal: scaleWidth(16),
            paddingBottom: scaleHeight(12),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.side, { width: scaleWidth(40) }]}
        >
          <Ionicons name="chevron-back" size={scaleWidth(24)} color="black" />
        </TouchableOpacity>

        <View style={styles.center}>
          <Text style={[styles.title, { fontSize: scaleFont(20) }]}>{title}</Text>
        </View>

        <View style={[styles.side, { width: scaleWidth(40) }]} />
      </View>

      <View
        style={[
          styles.separator,
          {
            height: scaleHeight(1),
            marginHorizontal: 0,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  separator: {
    backgroundColor: '#DADADA',
  },
});
