import type { Article, Question } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  FlatList,
  Image,
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionBar from './ActionBar';
import ArticleCard from './ArticleCard';
import FixedPageBadge from './FixedPageBadge';

type Props = {
  item: Article;
  onPressMenu?: (article: Article) => void;
};

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  // UTC → KST(+9h)
  const kstTime = t + 9 * 60 * 60 * 1000;
  const diff = Math.max(0, Date.now() - kstTime);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

type PageItem =
  | { type: 'title' }
  | { type: 'question'; data: Question }
  | { type: 'image' };

function useStyles() {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  return React.useMemo(
    () =>
      StyleSheet.create({
        wrapper: { paddingHorizontal: scaleWidth(16) },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: scaleHeight(8),
        },
        profileRow: { flexDirection: 'row', alignItems: 'center' },
        avatar: { backgroundColor: '#DDD', marginRight: scaleWidth(8) },
        nickname: { color: '#3E3E3E', fontWeight: '700', fontSize: scaleFont(14) },
        timeInline: { color: '#9E9E9E', fontSize: scaleFont(12) },
        menuButton: { paddingLeft: scaleWidth(8), paddingVertical: scaleHeight(4) },
      }),
    [scaleWidth, scaleHeight, scaleFont],
  );
}

export default function ArticleFrame({ item, onPressMenu }: Props) {
  const { smartScale, scaleHeight, scaleWidth } = useResponsiveSize();
  const styles = useStyles();
  const router = useRouter();

  const [listWidth, setListWidth] = React.useState(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const hasAvatar = !!item.memberProfileUrl;

  const badgeOpacity = React.useRef(new Animated.Value(0)).current;
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBadge = React.useCallback((visibleMs = 1400) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    Animated.timing(badgeOpacity, { toValue: 1, duration: 140, useNativeDriver: true }).start();

    hideTimerRef.current = setTimeout(() => {
      Animated.timing(badgeOpacity, { toValue: 0, duration: 180, useNativeDriver: true }).start();
      hideTimerRef.current = null;
    }, visibleMs);
  }, [badgeOpacity]);

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const onListLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w && w !== listWidth) setListWidth(w);
  };

  const goProfile = React.useCallback(() => {
    router.push({ pathname: '/profile/[id]', params: { id: String(item.memberId) } } as any);
  }, [router, item.memberId]);

  const onScrollBeginDrag = React.useCallback(() => {
    showBadge(); // 드래그 시작 시 표시
  }, [showBadge]);

  const onMomentumScrollEnd = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const w = e.nativeEvent.layoutMeasurement.width;
      const idx = Math.round(x / Math.max(1, w));
      setCurrentIndex(Math.max(0, Math.min(idx, pages.length - 1)));
      showBadge();
    },
    [showBadge],
  );

  const lastScrollShowRef = React.useRef(0);
  const onScroll = React.useCallback(() => {
    const now = Date.now();
    if (now - lastScrollShowRef.current > 200) {
      lastScrollShowRef.current = now;
      showBadge();
    }
  }, [showBadge]);

  const onTouchStart = React.useCallback(() => {
    showBadge();
  }, [showBadge]);

  const pages = React.useMemo<PageItem[]>(() => {
    const qPages: PageItem[] = (item.question ?? []).map((q) => ({ type: 'question', data: q }));
    return [{ type: 'title' }, ...qPages, { type: 'image' }];
  }, [item]);

  const pagesLenRef = React.useRef(pages.length);
  React.useEffect(() => {
    pagesLenRef.current = pages.length;
  }, [pages.length]);

  const onMomentumScrollEndSafe = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const w = e.nativeEvent.layoutMeasurement.width;
      const idx = Math.round(x / Math.max(1, w));
      setCurrentIndex(Math.max(0, Math.min(idx, pagesLenRef.current - 1)));
      showBadge();
    },
    [showBadge],
  );

  const renderCard: ListRenderItem<PageItem> = ({ item: page, index }) => (
    <View style={{ width: listWidth || 0, height: listWidth || 0 }}>
      <ArticleCard
        item={item}
        index={index}
        total={pages.length}
        mode={page.type as 'title' | 'question' | 'image'}
        question={page.type === 'question' ? page.data : undefined}
        style={{ flex: 1 }}
      />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.profileRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goProfile}
            style={styles.profileRow}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            {hasAvatar && (
              <Image
                source={{ uri: item.memberProfileUrl }}
                style={[
                  styles.avatar,
                  { width: scaleWidth(32), height: scaleWidth(32), borderRadius: scaleWidth(16) },
                ]}
              />
            )}
            <Text style={styles.nickname}>{item.memberNickName}</Text>
            <View style={{ marginHorizontal: scaleWidth(8) }} />
            <Text style={styles.timeInline}>{timeAgo(item.createdAt)}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressMenu?.(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-horizontal" size={smartScale(18, 22)} color="#9E9E9E" />
        </TouchableOpacity>
      </View>

      <View
        onLayout={onListLayout}
        onTouchStart={onTouchStart}
        style={{
          width: '100%',
          height: listWidth || undefined,
          aspectRatio: listWidth ? undefined : 1,
          position: 'relative', // 오버레이 기준
        }}
      >
        <FlatList<PageItem>
          horizontal
          pagingEnabled
          bounces={false}
          disableIntervalMomentum
          decelerationRate="fast"
          data={pages}
          renderItem={renderCard}
          keyExtractor={(_, idx) => String(idx)}
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={onScrollBeginDrag}
          onMomentumScrollEnd={onMomentumScrollEndSafe}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />

        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { opacity: badgeOpacity }]}
        >
          <FixedPageBadge index={currentIndex} total={pages.length} />
        </Animated.View>
      </View>

      <View style={{ marginVertical: scaleHeight(10)}}>
        <ActionBar articleId={item.id} />
      </View>
    </View>
  );
}
