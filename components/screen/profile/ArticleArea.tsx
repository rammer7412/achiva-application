import { useMyArticles } from '@/api/useMyArticles';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import type { Article, SortOption } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { ActivityIndicator, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ArticleHeader from './ArticleHeader';


export type ArticleAreaHandle = {
  onParentScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refresh: () => Promise<void>;
};

type Props = {
  onPressItem?: (item: Article) => void;
};

const ArticleArea = forwardRef<ArticleAreaHandle, Props>(function ArticleArea({ onPressItem }, ref) {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();
  const gap = scaleWidth(1);

  const [sort, setSort] = useState<SortOption>('createdAt,DESC');
  const { items, total, loadingFirst, loadingMore, isLast, loadMore, refresh } = useMyArticles(sort);

  const dateLabel = (iso?: string) =>
    !iso ? '' : iso.slice(0, 10).replace(/-/g, '.');

  const isCloseToBottom = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
  }, []);

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
    <View style={{ gap: scaleHeight(4) }}>
      <ArticleHeader total={total} sort={sort} onChangeSort={setSort} />

      
      {loadingFirst && items.length === 0 ? (
        Skeleton
      ) : (
        <PaddingContainer>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2 }}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => onPressItem?.(item)}
              style={{ width: '33.3333%', paddingHorizontal: gap / 2, marginBottom: gap }}
            >
              <View style={{ aspectRatio: 1, borderRadius: 4, overflow: 'hidden', backgroundColor: '#000' }}>

                {item.photoUrl ? (
                  <Image
                    source={{ uri: item.photoUrl }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: '#222' }]} />
                )}


                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.40)' }]} />

                <View
                  style={[
                    styles.overlayContent,
                    {
                      left: scaleWidth(10),
                      right: scaleWidth(10),
                      top: scaleHeight(10),
                      bottom: scaleHeight(10),
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    },
                  ]}
                >
                  <Text style={[styles.date, { fontSize: scaleFont(12) }]}>
                    {dateLabel(item.createdAt)}
                  </Text>

                  <Text
                    style={[
                      styles.title,
                      { fontSize: scaleFont(22), lineHeight: scaleFont(28) },
                    ]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <Text numberOfLines={1} style={[styles.metaLine, { fontSize: scaleFont(16) }]}>
                    <Text style={styles.metaStrong}>{item.category}</Text>
                    <Text style={styles.meta}> 기록</Text>
                  </Text>

                  <Text numberOfLines={1} style={[styles.metaLine, { fontSize: scaleFont(16) }]}>
                    <Text style={styles.metaStrong}>{item.authorCategorySeq}</Text>
                    <Text style={styles.meta}>번째 이야기</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        </PaddingContainer>
      )}

      {loadingMore && (
        <ActivityIndicator style={{ marginTop: scaleHeight(12), marginBottom: scaleHeight(8) }} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  overlayContent: {
    position: 'absolute',
    gap: 4,
  },
  date: {
    color: '#E0DFDE',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-ExtraBold',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  metaLine: {
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  metaStrong: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-ExtraBold',
  },

  meta: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    opacity: 0.95,
  },
});



export default ArticleArea;
