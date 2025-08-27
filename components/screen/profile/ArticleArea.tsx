import { myArticles } from '@/api/article';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { Article, SortOption } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import ArticleGrid from './ArticleGrid';
import ArticleHeader from './ArticleHeader';

type Props = {
  onPressItem?: (item: Article) => void;
};

export function ArticleArea({ onPressItem }: Props) {
  const { scaleHeight } = useResponsiveSize();

  const [sort, setSort] = useState<SortOption>('createdAt,DESC');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);

  const loadPage = useCallback(
    async (p: number, s: SortOption) => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await myArticles({ page: p, size: 12, sort: s });
        setItems((prev) => (p === 0 ? res.content : [...prev, ...res.content]));
        setTotal(res.totalElements ?? res.numberOfElements ?? 0);
        setIsLast(res.last);
        setPage(res.number);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  // 최초/정렬 변경 시 로드
  React.useEffect(() => {
    loadPage(0, sort);
  }, [sort]);

  const onEndReached = useCallback(() => {
    if (!loading && !isLast) loadPage(page + 1, sort);
  }, [loading, isLast, page, sort, loadPage]);

  const header = useMemo(
    () => <ArticleHeader total={total} sort={sort} onChangeSort={setSort} />,
    [total, sort],
  );

  return (
    <PaddingContainer>
      <View style={{ gap: scaleHeight(12) }}>
        {header}
        <ArticleGrid
          items={items}
          loading={loading && items.length === 0}
          onPressItem={onPressItem}
          onEndReached={onEndReached}
        />
        {loading && items.length > 0 ? (
          <ActivityIndicator style={{ marginTop: scaleHeight(12) }} />
        ) : null}
      </View>
    </PaddingContainer>
  );
}

export default ArticleArea;
