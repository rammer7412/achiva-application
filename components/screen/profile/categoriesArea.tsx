// components/screen/profile/CategoriesArea.tsx
import { fetchMemberProfile } from '@/api/member';
import CategoryChip from '@/components/chips/CategoryChip';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useAuthStore } from '@/stores/useAuthStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

type CategoriesAreaProps = {
  title?: string;
  isSelf?: boolean;      // 기본 true → 내 프로필
  memberId?: number;     // 타인 프로필일 때만 필요
};

export function CategoriesArea({
  title = '성취 카테고리',
  isSelf = true,
  memberId,
}: CategoriesAreaProps) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const selfCategories = useAuthStore((s) => s.user?.categories ?? []);

  const [otherCategories, setOtherCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!isSelf && memberId) {
      (async () => {
        try {
          const res = await fetchMemberProfile(memberId);
          setOtherCategories(res.categories ?? []);
        } catch (e) {
          if (__DEV__) console.log('[CategoriesArea] fetch failed:', e);
        }
      })();
    }
  }, [isSelf, memberId]);

  const categories = isSelf ? selfCategories : otherCategories;

  return (
    <PaddingContainer>
      <View style={{ paddingBottom: scaleHeight(12) }}>
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
