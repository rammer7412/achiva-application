import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = { title: string };

export default function HeaderWithBack({ title }: Props) {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont, safeArea } = useResponsiveSize();

  const H_PADDING = scaleWidth(16); // ← 콘텐츠 좌우 패딩 값

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          marginTop: safeArea.top + scaleHeight(10),
          paddingTop: scaleHeight(30),
          marginBottom: scaleHeight(10),
          // width: '100%' // 기본값으로 충분
        }}
      >
        <View
          style={[
            styles.headerRow,
            { paddingHorizontal: H_PADDING, paddingBottom: scaleHeight(12) },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.side, { width: scaleWidth(40) }]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="chevron-back" size={scaleWidth(24)} color="black" />
          </TouchableOpacity>

          <View style={styles.center}>
            <Text style={[styles.title, { fontSize: scaleFont(20) }]} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <View style={[styles.side, { width: scaleWidth(40) }]} />
        </View>

        {/* 패딩을 무시하고 화면 전체로 뻗는 구분선 */}
        <View
          style={{
            height: scaleHeight(1),
            backgroundColor: '#DADADA',
            marginHorizontal: -H_PADDING * 2,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },
  title: { fontWeight: 'bold', color: '#000000', textAlign: 'center' },
});
