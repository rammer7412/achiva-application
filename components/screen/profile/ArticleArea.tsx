import { useMyArticles } from '@/api/useMyArticles';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import type { Article, SortOption } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { ActivityIndicator, Image, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, View } from 'react-native';
import ArticleHeader from './ArticleHeader';

export type ArticleAreaHandle = {
  onParentScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refresh: () => Promise<void>;
};

type Props = {
  onPressItem?: (item: Article) => void;
};

const ArticleArea = forwardRef<ArticleAreaHandle, Props>(function ArticleArea({ onPressItem }, ref) {
  const { smartScale, scaleHeight } = useResponsiveSize();
  const gap = smartScale(6, 10);

  const [sort, setSort] = useState<SortOption>('createdAt,DESC');
  const { items, total, loadingFirst, loadingMore, isLast, loadMore, refresh } = useMyArticles(sort);

  // 스크롤 끝 근처 판정
  const isCloseToBottom = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 200; // 200px 여유
  }, []);

  // 부모 ScrollView의 onScroll을 ArticleArea가 처리할 수 있도록 외부에 메서드 노출
  useImperativeHandle(ref, () => ({
    onParentScroll: (e) => {
      if (isCloseToBottom(e) && !loadingMore && !isLast) loadMore();
    },
    refresh,
  }), [isCloseToBottom, loadingMore, isLast, loadMore, refresh]);

  const Skeleton = useMemo(() => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <View key={i} style={{ width: '33.3333%', paddingHorizontal: gap / 2, marginBottom: gap }}>
          <View style={{ aspectRatio: 1, borderRadius: 10, backgroundColor: '#3a3a3a' }} />
        </View>
      ))}
    </View>
  ), [gap]);

  return (
    <View style={{ gap: scaleHeight(12) }}>
      <PaddingContainer>
        <ArticleHeader total={total} sort={sort} onChangeSort={setSort} />
      </PaddingContainer>

      {/* 수동 그리드 */}
      {loadingFirst && items.length === 0 ? (
        Skeleton
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2 }}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => onPressItem?.(item)}
              style={{ width: '33.3333%', paddingHorizontal: gap / 2, marginBottom: gap }}
            >
              <View style={{ aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: '#333' }}>
                {!!item.photoUrl && (
                  <Image source={{ uri: item.photoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loadingMore && (
        <ActivityIndicator style={{ marginTop: scaleHeight(12), marginBottom: scaleHeight(8) }} />
      )}
    </View>
  );
});

export default ArticleArea;
