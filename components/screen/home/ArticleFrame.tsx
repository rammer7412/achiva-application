import type { Article, Question } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionBar from './ActionBar';
import ArticleCard from './ArticleCard';

type Props = {
  item: Article;
  onPressMenu?: (article: Article) => void;
};

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - t);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

type PageItem =
  | { type: 'title' }
  | { type: 'question'; data: Question };

/** 반응형 스타일 생성기 */
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
          marginBottom: scaleHeight(8),
        },
        profileRow: { flexDirection: 'row', alignItems: 'center' },
        avatar: { backgroundColor: '#DDD', marginRight: scaleWidth(8) },
        nickname: {
          color: '#3E3E3E',
          fontWeight: '700',
          fontSize: scaleFont(14),
        },
        dot: {
          color: '#9E9E9E',
          marginHorizontal: scaleWidth(6),
          fontSize: scaleFont(12),
        },
        timeInline: { color: '#9E9E9E', fontSize: scaleFont(12) },
        menuButton: {
          paddingLeft: scaleWidth(8),
          paddingVertical: scaleHeight(4),
        },
      }),
    [scaleWidth, scaleHeight, scaleFont]
  );
}

export default function ArticleFrame({ item, onPressMenu }: Props) {
  const { smartScale, scaleHeight, scaleWidth } = useResponsiveSize();
  const styles = useStyles();

  const [listWidth, setListWidth] = React.useState(0);
  const hasAvatar = !!item.memberProfileUrl;

  const pages = React.useMemo<PageItem[]>(() => {
    const qPages: PageItem[] = (item.question ?? []).map((q) => ({
      type: 'question',
      data: q,
    }));
    return [{ type: 'title' }, ...qPages];
  }, [item]);

  const onListLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w && w !== listWidth) setListWidth(w);
  };

  const renderCard: ListRenderItem<PageItem> = ({ item: page, index }) => (
    // 정사각형: width = viewport, height = width
    <View style={{ width: listWidth || 0, aspectRatio: 1 }}>
      <ArticleCard
        item={item}
        index={index}
        total={pages.length}
        mode={page.type}
        question={page.type === 'question' ? page.data : undefined}
        style={{ flex: 1 }}
      />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* 작성자 영역 */}
      <View style={styles.headerRow}>
        <View style={styles.profileRow}>
          {hasAvatar && (
            <Image
              source={{ uri: item.memberProfileUrl }}
              style={[
                styles.avatar,
                {
                  width: scaleWidth(32),
                  height: scaleWidth(32),
                  borderRadius: scaleWidth(16),
                },
              ]}
            />
          )}
          <Text style={styles.nickname}>{item.memberNickName}</Text>
          <View style={{ marginHorizontal: scaleWidth(8) }} />
          <Text style={styles.timeInline}>{timeAgo(item.createdAt)}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressMenu?.(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.menuButton}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={smartScale(18, 22)}
            color="#9E9E9E"
          />
        </TouchableOpacity>
      </View>

      {/* 본문: 가로 스와이프 카드 (옆 카드 미노출 + 정사각형) */}
      <View onLayout={onListLayout}>
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
          contentContainerStyle={{}}
        />
      </View>

      {/* 액션 바 */}
      <View style={{ marginTop: scaleHeight(10) }}>
        <ActionBar />
      </View>
    </View>
  );
}
