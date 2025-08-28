import type { Article, SortOption } from '@/types/ApiTypes';
import { useCallback, useEffect, useState } from 'react';
import { userArticles } from './article';

export function useUserArticles(userId: number, sort: SortOption) {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLast, setIsLast] = useState(false);

  const load = useCallback(
    async (p: number, mode: 'refresh' | 'more' = 'refresh') => {
      mode === 'refresh' ? setLoadingFirst(true) : setLoadingMore(true);
      try {
        const res = await userArticles(userId, { page: p, size: 12, sort });
        setItems(prev => (mode === 'refresh' ? res.content : [...prev, ...res.content]));
        setTotal(res.totalElements ?? res.numberOfElements ?? 0);
        setIsLast(res.last);
        setPage(res.number);
      } finally {
        mode === 'refresh' ? setLoadingFirst(false) : setLoadingMore(false);
      }
    },
    [userId, sort]
  );

  useEffect(() => { load(0, 'refresh'); }, [load]);

  const loadMore = useCallback(() => {
    if (!loadingMore && !isLast) load(page + 1, 'more');
  }, [loadingMore, isLast, page, load]);

  const refresh = useCallback(async () => { await load(0, 'refresh'); }, [load]);

  return { items, total, loadingFirst, loadingMore, isLast, loadMore, refresh };
}
