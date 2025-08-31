// screens/Home/HomeScreen.tsx
import { HomeArticles, userFeedArticles } from '@/api/article';
import ArticleWriteButton from '@/components/buttons/ArticleWriteButton';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import PlusSquare from '@/components/icons/PlusSquare';
import ACHIVALogo from '@/components/logo/ACHIVA-logo';
import ArticleFrame from '@/components/screen/home/ArticleFrame';
import { SimpleText } from '@/components/text/SimpleText';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Article, PageResponse } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';

type HeaderProps = { onPressLogo?: () => void };

function HomeHeader({ onPressLogo }: HeaderProps) {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();
  const router = useRouter();
  return (
    <PaddingContainer>
      <View style={{ gap: scaleHeight(15), marginTop: scaleHeight(42) }}>

        <TouchableOpacity activeOpacity={0.7} onPress={onPressLogo}>
          <ACHIVALogo/>
        </TouchableOpacity>

        <ArticleWriteButton
          text="오늘의 새로운 이야기를 남겨주세요"
          onPress={() => {router.push('/(tab)/post')}}
          icon={<PlusSquare size={scaleWidth(18)} color="#FFFFFF" />}
        />
      </View>
      <View style={{ marginTop: scaleHeight(42), marginBottom: scaleHeight(12) }}>
        <SimpleText
          text="나를 응원해준 사람들의 이야기"
          color="#412A2A"
          fontFamily="Pretendard-ExtraBold"
          size={scaleFont(16)}
        />
      </View>
    </PaddingContainer>
  );
}

export default function HomeScreen() {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();

  const [items, setItems] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (p: number, mode: 'replace' | 'append') => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const data = (await HomeArticles({
          page: p,
          size,
          sort: 'createdAt,DESC',
        })) as PageResponse<Article>;
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
    await fetchUFPage(0, 'replace');
    setRefreshing(false);
  }, [fetchPage]);

  const onPressLogo = useCallback(() => {
  if (refreshing || loadingRef.current) return;
  onRefresh();
}, [onRefresh, refreshing]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || loading || isLast) return;
    fetchPage(page + 1, 'append');
  }, [fetchPage, isLast, loading, page]);

  const renderItem: ListRenderItem<Article> = useCallback(
    ({ item }) => <ArticleFrame item={item} />,
    []
  );

  const keyExtractor = useCallback((it: Article) => String(it.id), []);

  const memberId = useAuthStore((s) => s.user?.id ?? null);

  const [ufItems, setUFItems] = useState<Article[]>([]);
  const [ufPage, setUFPage] = useState(0);
  const [ufSize] = useState(6);
  const [ufIsLast, setUFIsLast] = useState(false);
  const [ufLoading, setUFLoading] = useState(false);
  const [ufLoadingFirst, setUFLoadingFirst] = useState(false);
  const ufLoadingRef = useRef(false);

  const fetchUFPage = useCallback(
    async (p: number, mode: 'replace' | 'append') => {
      if (!memberId) return;
      if (ufLoadingRef.current) return;
      ufLoadingRef.current = true;
      setUFLoading(true);
      if (p === 0 && mode === 'replace') setUFLoadingFirst(true);
      try {
        const data = (await userFeedArticles(memberId, {
          page: p,
          size: ufSize,
          sort: 'createdAt,DESC',
        })) as PageResponse<Article>;
        setUFIsLast(!!data.last);
        setUFPage(data.number);
        const next = data.content ?? [];
        setUFItems((prev) => (mode === 'replace' ? next : [...prev, ...next]));
      } catch (e) {
        console.warn('[userFeed] fetch error', e);
      } finally {
        setUFLoading(false);
        setUFLoadingFirst(false);
        ufLoadingRef.current = false;
      }
    },
    [memberId, ufSize]
  );

  useEffect(() => {
    if (memberId) fetchUFPage(0, 'replace');
  }, [memberId, fetchUFPage]);

  const loadUFMore = useCallback(() => {
    if (ufLoadingRef.current || ufLoading || ufIsLast) return;
    fetchUFPage(ufPage + 1, 'append');
  }, [fetchUFPage, ufIsLast, ufLoading, ufPage]);

  const Footer = useMemo(() => {
    return (
      <View style={{ paddingBottom: scaleHeight(40) }}>
        {loading ? (
          <View style={{ paddingVertical: scaleHeight(24) }}>
            <ActivityIndicator />
          </View>
        ) : null}

        <View style={{ height: scaleHeight(10) }} />

        <PaddingContainer>
          <View style={{ marginTop: scaleHeight(42), marginBottom: scaleHeight(12) }}>
            <SimpleText
              text="관심있는 성취 카테고리 이야기"
              color="#412A2A"
              fontFamily="Pretendard-ExtraBold"
              size={scaleFont(16)}
            />
          </View>
        </PaddingContainer>

        {ufLoadingFirst ? (
          <View style={{ paddingVertical: scaleHeight(24), alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : ufItems.length === 0 ? (
          <PaddingContainer>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: scaleHeight(60),
              }}
            >
              <SimpleText
                text="관심 카테고리의 게시글이 아직 없어요"
                color="#A5A5A5"
                size={scaleFont(12)}
              />
              <View style={{ height: scaleHeight(6) }} />
              <SimpleText
                text="관심 카테고리를 더 추가해보세요!"
                color="#A5A5A5"
                size={scaleFont(12)}
              />
            </View>
          </PaddingContainer>
        ) : (
          <View>

            <View style={{ height: scaleHeight(14) }} />
              <View style={{ gap: scaleHeight(20) }}>
                {ufItems.map((it) => (
                  <ArticleFrame key={`uf-${it.id}`} item={it} />
                ))}
              </View>

            {!ufIsLast ? (
              <PaddingContainer>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={loadUFMore}
                    activeOpacity={0.8}
                    style={{
                      marginTop: scaleHeight(18),
                      paddingVertical: scaleHeight(10),
                      paddingHorizontal: scaleWidth(18),
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#B8AEAA',
                    }}
                  >
                    <SimpleText
                      text={ufLoading ? '불러오는 중…' : '더 보기'}
                      color="#412A2A"
                      size={scaleFont(12)}
                    />
                  </TouchableOpacity>
                </View>
              </PaddingContainer>
            ) : null}

            {ufLoading && (
              <View style={{ paddingVertical: scaleHeight(16), alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            )}
          </View>
        )}
      </View>
    );
  }, [
    loading,
    scaleHeight,
    ufItems,
    ufIsLast,
    ufLoading,
    ufLoadingFirst,
    loadUFMore,
    scaleFont,
    scaleWidth,
  ]);

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={<HomeHeader onPressLogo={onPressLogo}/>}
      ListFooterComponent={Footer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReachedThreshold={0.35}
      onEndReached={loadMore}
      ItemSeparatorComponent={() => <View style={{ height: scaleHeight(20) }} />}
      contentContainerStyle={{ paddingBottom: 0 }}
    />
  );
}
