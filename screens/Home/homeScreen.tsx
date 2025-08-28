// screens/Home/HomeScreen.tsx
import { HomeArticles } from '@/api/article';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import ACHIVALogo from '@/components/logo/ACHIVA-logo';
import ArticleFrame from '@/components/screen/home/ArticleFrame';
import { SimpleText } from '@/components/text/SimpleText';
import type { Article, PageResponse } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  View,
} from 'react-native';

function HomeHeader() {
  const { scaleHeight } = useResponsiveSize();
  return (
    <PaddingContainer>
      <View style={{ marginVertical: scaleHeight(20) }}>
        <ACHIVALogo />
        {/* TODO: ConfirmButton 배치 */}
        <SimpleText text="나를 응원해준 사람들의 이야기" />
      </View>
    </PaddingContainer>
  );
}

export default function HomeScreen() {
  const { scaleHeight } = useResponsiveSize();

  const [items, setItems] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const loadingRef = useRef(false); // onEndReached 중복 방지

  const fetchPage = useCallback(
    async (p: number, mode: 'replace' | 'append') => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const data = (await HomeArticles({ page: p, size, sort: 'createdAt,DESC' })) as PageResponse<Article>;
        setIsLast(!!data.last);
        setPage(data.number);
        const next = data.content ?? [];
        setItems((prev) => (mode === 'replace' ? next : [...prev, ...next]));
      } catch (e) {
        console.warn('[home] fetch error', e);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [size]
  );

  // 최초 로드
  useEffect(() => {
    fetchPage(0, 'replace');
  }, [fetchPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPage(0, 'replace');
    setRefreshing(false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || loading || isLast) return;
    fetchPage(page + 1, 'append');
  }, [fetchPage, isLast, loading, page]);

  // 각 아이템 사이 간격은 ItemSeparator로 처리(성능+가독성)
  const renderItem: ListRenderItem<Article> = useCallback(
    ({ item }) => <ArticleFrame item={item} />,
    []
  );

  const keyExtractor = useCallback((it: Article) => String(it.id), []);

  const Footer = useMemo(
    () =>
      loading ? (
        <View style={{ paddingVertical: scaleHeight(24) }}>
          <ActivityIndicator />
        </View>
      ) : null,
    [loading, scaleHeight]
  );

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={<HomeHeader />}
      ListFooterComponent={Footer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReachedThreshold={0.35}
      onEndReached={loadMore}
      ItemSeparatorComponent={() => <View style={{ height: scaleHeight(20) }} />}
      contentContainerStyle={{ paddingBottom: scaleHeight(40) }}
    />
  );
}
