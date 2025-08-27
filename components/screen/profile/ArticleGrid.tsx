import { Article } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { memo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import ArticleTile from './ArticleTile';

type Props = {
  items: Article[];
  loading?: boolean;
  onPressItem?: (item: Article) => void;
  onEndReached?: () => void;
};

function ArticleGrid({ items, loading, onPressItem, onEndReached }: Props) {
  const { smartScale } = useResponsiveSize();
  const gap = smartScale(6, 10);

  const renderItem: ListRenderItem<Article> = ({ item }) => (
    <ArticleTile item={item} gap={gap} onPress={() => onPressItem?.(item)} />
  );

  // 로딩 스켈레톤 (초기)
  if (loading) {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: '33.3333%',
              padding: gap / 2,
            }}
          >
            <View style={{ aspectRatio: 1, borderRadius: 10, backgroundColor: '#3a3a3a' }} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => String(it.id)}
      renderItem={renderItem}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: smartScale(12, 18) }}
      columnWrapperStyle={{ gap }}
      onEndReachedThreshold={0.6}
      onEndReached={onEndReached}
    />
  );
}

export default memo(ArticleGrid);
