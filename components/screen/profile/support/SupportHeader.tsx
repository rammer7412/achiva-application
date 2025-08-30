// components/screen/profile/support/SupportHeader.tsx
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { SimpleText } from '@/components/text/SimpleText';
import { useAuthStore } from '@/stores/useAuthStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  userName: string;
  isSelf?: boolean;
  memberId?: number;
  onClose: () => void;
};

export default function SupportHeader({ userName='ACHIVA_123', isSelf=true, memberId, onClose }: Props) {
  const { scaleFont, scaleHeight, scaleWidth } = useResponsiveSize();
  const me = useAuthStore((s) => s.user);
  
  return (
    <PaddingContainer>
      <View style={styles.headerRow}>
        <View style={{paddingTop: scaleHeight(48), flexDirection: 'row', alignItems: 'baseline', flexShrink: 1 }}>
          <Text
            style={[styles.userName, { fontSize: scaleFont(24), marginRight: scaleWidth(8) }]}
            numberOfLines={1}
          >
            {userName}
          </Text>

          <SimpleText
            text="님의 응원 기록"
            style={{ color: '#808080', fontFamily: 'Pretendard-Thin', fontSize: scaleFont(18) }}
            numberOfLines={1}
          />
        </View>

        {/* 닫기 버튼 */}
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={{ fontSize: scaleFont(20), color: '#2B1E19' }}>✕</Text>
        </Pressable>
      </View>

      <View style={{ height: scaleHeight(12), marginBottom: scaleHeight(60) }} />
    </PaddingContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#2B1E19', fontWeight: '800' },
  userName: { color: '#2B1E19', fontFamily: 'Pretendard-ExtraBold' },
  muted: { color: '#A3948D', fontWeight: '600' },
});
