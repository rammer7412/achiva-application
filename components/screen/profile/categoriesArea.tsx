import CategoryChip from '@/components/chips/CategoryChip';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useAuthStore } from '@/stores/useAuthStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Text, View } from 'react-native';

type CategoriesAreaProps = {
  title?: string;
};

export function CategoriesArea({
  title = '성취 카테고리',
}: CategoriesAreaProps) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const categories = useAuthStore((s) => s.user?.categories ?? []);
  return (
    <PaddingContainer>
      <View
        style={{
          paddingBottom: scaleHeight(12),
        }}
      >
        {/* 제목 */}
        <Text
          style={{
            fontSize: scaleFont(20),
            fontFamily: 'Pretendard-ExtraBold',
            color: '#000',
            marginBottom: scaleHeight(8),
          }}
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <View
              key={c}
              style={{
                marginRight: scaleWidth(8),
                marginBottom: scaleHeight(8),
              }}
            >
              <CategoryChip label={c} />
            </View>
          ))}
        </View>
      </View>
    </PaddingContainer>
  );
}


