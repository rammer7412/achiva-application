import { useMyArticles } from '@/api/useMyArticles';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import ArticleFrame from '@/components/screen/home/ArticleFrame'; // ← 경로 확인
import type { Article, SortOption } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import ArticleHeader from './ArticleHeader';

export type ArticleAreaHandle = {
  onParentScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refresh: (targetMemberId?: number) => Promise<void>;
};

type Props = {
  onPressItem?: (item: Article) => void;
  isSelf?: boolean;
  memberId?: number;
};

const ArticleArea = forwardRef<ArticleAreaHandle, Props>(function ArticleArea(
  { onPressItem, isSelf = true, memberId },
  ref,
) {
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();
  const gap = scaleWidth(1);

  const [sort, setSort] = useState<SortOption>('createdAt,DESC');

  const {
    items,
    total,
    loadingFirst,
    loadingMore,
    isLast,
    loadMore,
    refresh,
  } = useMyArticles(sort, memberId);

  // 상세 모달 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Article | null>(null);

  const openDetail = (item: Article) => {
    if (onPressItem) {
      onPressItem(item);
      return;
    }
    setSelected(item);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setTimeout(() => setSelected(null), 150);
  };

  const dateLabel = (iso?: string) =>
    !iso ? '' : iso.slice(0, 10).replace(/-/g, '.');

  const isCloseToBottom = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onParentScroll: (e) => {
        if (isCloseToBottom(e) && !loadingMore && !isLast) loadMore();
      },
      refresh: async () => {
        await refresh();
      },
    }),
    [isCloseToBottom, loadingMore, isLast, loadMore, refresh],
  );

  const Skeleton = useMemo(
    () => (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -gap / 2,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: '33.3333%',
              paddingHorizontal: gap / 2,
              marginBottom: gap,
            }}
          >
            <View
              style={{
                aspectRatio: 1,
                borderRadius: 10,
                backgroundColor: '#3a3a3a',
              }}
            />
          </View>
        ))}
      </View>
    ),
    [gap],
  );

  const EmptyState = useMemo(
    () => (
      <PaddingContainer>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: scaleHeight(120),
          }}
        >
          <Text
            style={{
              color: '#A5A5A5',
              fontSize: scaleFont(16),
              lineHeight: scaleFont(24),
              textAlign: 'center',
            }}
          >
            여기엔 성취 기록이 담겨요
          </Text>
          <Text
            style={{
              color: '#A5A5A5',
              fontSize: scaleFont(16),
              lineHeight: scaleFont(24),
              textAlign: 'center',
              marginTop: scaleHeight(2),
            }}
          >
            첫 성취를 기록해보세요
          </Text>
        </View>
      </PaddingContainer>
    ),
    [scaleFont, scaleHeight],
  );

  const Grid = (
    <PaddingContainer>
      <View
        style={{
          marginVertical: scaleHeight(4),
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -gap / 2,
        }}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => openDetail(item)}
            style={{
              width: '33.3333%',
              paddingHorizontal: gap / 2,
              marginBottom: gap,
            }}
          >
            <View
              style={{
                aspectRatio: 1,
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: '#000',
              }}
            >
              {item.photoUrl ? (
                <Image
                  source={{ uri: item.photoUrl }}
                  style={StyleSheet.absoluteFillObject as any}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFillObject as any,
                    { backgroundColor: '#222' },
                  ]}
                />
              )}

              <View
                style={[
                  StyleSheet.absoluteFillObject as any,
                  { backgroundColor: 'rgba(0,0,0,0.40)' },
                ]}
              />

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

                <Text
                  numberOfLines={1}
                  style={[styles.metaLine, { fontSize: scaleFont(16) }]}
                >
                  <Text style={styles.metaStrong}>{item.category}</Text>
                  <Text style={styles.meta}> 기록</Text>
                </Text>

                <Text
                  numberOfLines={1}
                  style={[styles.metaLine, { fontSize: scaleFont(16) }]}
                >
                  <Text style={styles.metaStrong}>{item.authorCategorySeq}</Text>
                  <Text style={styles.meta}>번째 이야기</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </PaddingContainer>
  );

  return (
    <View style={{ gap: scaleHeight(4) }}>
      <ArticleHeader total={total} sort={sort} onChangeSort={setSort} />

      {loadingFirst && items.length === 0
        ? Skeleton
        : items.length === 0
        ? EmptyState
        : Grid}

      {loadingMore && (
        <ActivityIndicator
          style={{ marginTop: scaleHeight(12), marginBottom: scaleHeight(8) }}
        />
      )}

      {/* 센터 모달 */}
      <Modal
        visible={detailOpen && !!selected}
        transparent
        animationType="fade"
        onRequestClose={closeDetail}
      >
        {/* 배경 딤: 전체 덮음 */}
        <TouchableWithoutFeedback onPress={closeDetail}>
          <View style={styles.dim} />
        </TouchableWithoutFeedback>

        {/* 중앙 카드: 가로/세로 모두 중앙 정렬 */}
        <View style={styles.centerWrap} pointerEvents="box-none">
          <View style={styles.centerCard} pointerEvents="box-none">
            {selected && (
              <ArticleFrame
                item={selected}
                onPressMenu={() => {
                  // 메뉴 액션 필요 시
                }}
              />
            )}
          </View>
        </View>
      </Modal>
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

  /* ── 모달 스타일 ─────────────────────────── */
  dim: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject as any,
    justifyContent: 'center',   // 세로 가운데
    alignItems: 'center',       // 가로 가운데
  },
  centerCard: {
    maxHeight: '88%',
    width: '92%',               // 좌우 여백
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',         // ArticleFrame이 가장자리 넘어가지 않도록
    // 그림자
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
  },
});

export default ArticleArea;
