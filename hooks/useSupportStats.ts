// hooks/useSupportStats.ts
import { getReceivingCategoryStats, getSendingCategoryStats } from '@/api/cheering';
import type { CategoryKey, Variant } from '@/types/ApiTypes';
import * as React from 'react';

type Options = { enabled?: boolean; memberId?: number | null };

export type ButtonStatVM = {
  key: CategoryKey;
  label: string;
  points: number;
  count: number;
};

const ORDER: CategoryKey[] = ['BEST', 'CHEER', 'GOOD_JOB', 'MOTIVATION'];
const KR_TO_KEY: Record<string, CategoryKey> = {
  '최고예요': 'BEST',
  '응원해요': 'CHEER',
  '수고했어요': 'GOOD_JOB',
  '동기부여': 'MOTIVATION',
};

const KEY_TO_LABEL: Record<CategoryKey, string> = {
  BEST: '최고예요 👍',
  CHEER: '응원해요 🔥',
  GOOD_JOB: '수고했어요 💕',
  MOTIVATION: '동기부여 🍀',
};

export function useSupportStats(
  variant: Variant,
  { enabled = true, memberId }: Options = {}
) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [buttonStats, setButtonStats] = React.useState<ButtonStatVM[]>([]);
  const [totalPoints, setTotalPoints] = React.useState(0);

  const fetcher = React.useCallback(async (abort?: AbortSignal) => {
    if (!memberId) return;
    setLoading(true);
    setError(null);
    try {
      const fetchStats =
        variant === 'sent' ? getSendingCategoryStats : getReceivingCategoryStats;

      const raw = await fetchStats(memberId, abort);

      // 기본 0으로 모두 채운 뒤, 응답을 반영
      const acc: Record<CategoryKey, { points: number; count: number }> = {
        BEST: { points: 0, count: 0 },
        CHEER: { points: 0, count: 0 },
        GOOD_JOB: { points: 0, count: 0 },
        MOTIVATION: { points: 0, count: 0 },
      };

      raw.forEach(r => {
        const kr = (r.cheeringCategory ?? '').trim();
        const key = KR_TO_KEY[kr as keyof typeof KR_TO_KEY];
        if (key) {
          acc[key] = {
            points: Number(r.points) || 0,
            count: Number(r.count) || 0,
          };
        }
      });

      const list: ButtonStatVM[] = ORDER.map((k) => ({
        key: k,
        label: KEY_TO_LABEL[k],              // ← 화면 출력용(한글+이모지)
        points: acc[k].points,
        count: acc[k].count,
      }));

      setButtonStats(list);
      setTotalPoints(list.reduce((s, x) => s + x.points, 0));
    } catch (e: any) {
      if (e?.name !== 'CanceledError') setError(e);
    } finally {
      setLoading(false);
    }
  }, [memberId, variant]);

  React.useEffect(() => {
    if (!enabled || !memberId) return;
    const ac = new AbortController();
    fetcher(ac.signal);
    return () => ac.abort();
  }, [enabled, memberId, fetcher]);

  return { loading, error, buttonStats, totalPoints, refetch: fetcher };
}
