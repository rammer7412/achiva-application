// components/bars/ActionBar.tsx
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import CloverIcon from '@/components/icons/CloverIcon';
import FlameIcon from '@/components/icons/FlameIcon';
import HeartIcon from '@/components/icons/HeartIcon';
import ThumbIcon from '@/components/icons/ThumbIcon';

import { createCheering, deleteCheering, getCheeringFromArticles } from '@/api/cheering';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CategoryKeyKr, CreateCheeringPayload } from '@/types/ApiTypes';
import type { Cheering } from '@/types/Response';

type Props = {
  actions?: CategoryKeyKr[];
  style?: ViewStyle;
  onPressAction?: (label: CategoryKeyKr, isOn: boolean) => void;
  initialSelected?: CategoryKeyKr[];
  initialCheerings?: Partial<Record<CategoryKeyKr, Cheering>>;
  articleId: number;
  onCheeringCreated?: (cheering: Cheering, label: CategoryKeyKr) => void;
  onCheeringDeleted?: (label: CategoryKeyKr) => void;
  contentMap?: Partial<Record<CategoryKeyKr, string>>;
};

const ICON_BY_LABEL: Record<
  CategoryKeyKr,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  최고예요: ThumbIcon,
  수고했어요: FlameIcon,
  응원해요: HeartIcon,
  동기부여: CloverIcon,
};

function toLabelKr(raw: unknown): CategoryKeyKr | null {
  const s = String(raw ?? '').trim();
  if (s === '최고예요' || s === '응원해요' || s === '수고했어요' || s === '동기부여') return s as CategoryKeyKr;
  const map: Record<string, CategoryKeyKr> = {
    BEST: '최고예요',
    CHEER: '응원해요',
    GOOD_JOB: '수고했어요',
    MOTIVATION: '동기부여',
  };
  return map[s.toUpperCase()] ?? null;
}

export default function ActionBar({
  actions = ['최고예요', '수고했어요', '응원해요', '동기부여'],
  style,
  onPressAction,
  initialSelected = [],
  initialCheerings,
  articleId,
  onCheeringCreated,
  onCheeringDeleted,
  contentMap,
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const myId = useAuthStore((s) => s.user?.id ?? null);

  const [selectedSet, setSelectedSet] = React.useState<Set<CategoryKeyKr>>(
    () => new Set(initialSelected),
  );
  const [pendingSet, setPendingSet] = React.useState<Set<CategoryKeyKr>>(
    () => new Set(),
  );
  const [cheeringMap, setCheeringMap] = React.useState<Map<CategoryKeyKr, Cheering>>(
    () => {
      const m = new Map<CategoryKeyKr, Cheering>();
      if (initialCheerings) {
        (Object.keys(initialCheerings) as CategoryKeyKr[]).forEach((k) => {
          const v = initialCheerings[k];
          if (v) m.set(k, v);
        });
      }
      return m;
    },
  );

  /** 서버에서 '내가 보낸' 응원만 골라 현재 버튼 상태 동기화 */
  const syncMyCheerings = React.useCallback(async () => {
    if (myId == null) return;
    try {
      const page = await getCheeringFromArticles(articleId, {
        page: 0,
        size: 100,
        sort: 'createdAt,DESC',
      });

      // ➜ senderId가 내 id인 항목만 추림
      const mine = page.content.filter((c: any) => (c as any).senderId === myId);

      const nextSelected = new Set<CategoryKeyKr>();
      const nextMap = new Map<CategoryKeyKr, Cheering>();

      // createdAt DESC로 온다고 가정하고, 라벨별 첫 항목만 채택
      for (const c of mine) {
        const label = toLabelKr((c as any).cheeringCategory);
        if (!label) continue;
        if (!nextSelected.has(label)) {
          nextSelected.add(label);
          nextMap.set(label, c as Cheering);
        }
      }

      setSelectedSet(nextSelected);
      setCheeringMap(nextMap);
    } catch (e) {
      console.log('[ActionBar] syncMyCheerings error:', String((e as any)?.message || e));
    }
  }, [articleId, myId]);

  // 마운트/기사 변경/로그인 사용자 변경 시 서버 기준으로 맞춤
  React.useEffect(() => {
    syncMyCheerings();
  }, [syncMyCheerings]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        btnBase: {
          flex: 1,
          marginHorizontal: scaleWidth(2),
          paddingVertical: scaleHeight(8),
          borderRadius: 36,
          borderWidth: scaleWidth(1.2),
          alignItems: 'center',
          justifyContent: 'center',
        },
        btnOn: { backgroundColor: '#412A2A', borderColor: '#412A2A' },
        btnOff: { backgroundColor: '#FFFFFF', borderColor: '#412A2A' },
        contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
        textOn: {
          color: '#FFFFFF',
          fontSize: scaleFont(14),
          fontFamily: 'Pretendard-ExtraBold',
        },
        textOff: {
          color: '#412A2A',
          fontSize: scaleFont(14),
          fontFamily: 'Pretendard-ExtraBold',
        },
        iconSpacer: { marginLeft: scaleWidth(6) },
      }),
    [scaleWidth, scaleHeight, scaleFont],
  );

  const hit = {
    top: scaleHeight(6),
    bottom: scaleHeight(6),
    left: scaleWidth(6),
    right: scaleWidth(6),
  };

  const ICON_SIZE = scaleWidth(8);

  const toggle = async (label: CategoryKeyKr) => {
    if (pendingSet.has(label)) return;

    const isCurrentlyOn = selectedSet.has(label);

    // 낙관적 업데이트
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (isCurrentlyOn) next.delete(label);
      else next.add(label);
      return next;
    });
    onPressAction?.(label, !isCurrentlyOn);

    try {
      setPendingSet((p) => new Set(p).add(label));

      if (!isCurrentlyOn) {
        const payload: CreateCheeringPayload = {
          content: (contentMap?.[label] ?? label).trim(),
          cheeringCategory: label,
        };
        const cheering = await createCheering(articleId, payload);
        setCheeringMap((prev) => {
          const next = new Map(prev);
          next.set(label, cheering);
          return next;
        });
        onCheeringCreated?.(cheering, label);
      } else {
        const cheering = cheeringMap.get(label);
        if (!cheering?.id) throw new Error('NO_CHEERING_ID');
        await deleteCheering(articleId, cheering.id);
        setCheeringMap((prev) => {
          const next = new Map(prev);
          next.delete(label);
          return next;
        });
        onCheeringDeleted?.(label);
      }
    } catch (e: any) {
      // 실패 → 롤백
      setSelectedSet((prev) => {
        const next = new Set(prev);
        if (isCurrentlyOn) next.add(label);
        else next.delete(label);
        return next;
      });
      onPressAction?.(label, isCurrentlyOn);

      const msg = String(e?.message || '');
      let userMsg = '잠시 후 다시 시도해 주세요.';
      if (msg.includes('NO_CHEERING_ID')) userMsg = '취소할 응원 정보를 찾지 못했어요.';
      console.log('[cheering:toggle:error]', msg);
      Alert.alert('응원 처리 실패', userMsg);
    } finally {
      setPendingSet((p) => {
        const n = new Set(p);
        n.delete(label);
        return n;
      });
      // 서버 상태와 동기화(정합성 보정)
      syncMyCheerings();
    }
  };

  return (
    <PaddingContainer>
      <View style={[styles.container, style]}>
        {actions.map((label) => {
          const isOn = selectedSet.has(label);
          const isPending = pendingSet.has(label);
          const IconComp = ICON_BY_LABEL[label];
          const iconColor = isOn ? '#FFFFFF' : '#412A2A';

          return (
            <TouchableOpacity
              key={label}
              style={[
                styles.btnBase,
                isOn ? styles.btnOn : styles.btnOff,
                isPending && { opacity: 0.6 },
              ]}
              activeOpacity={0.85}
              hitSlop={hit}
              onPress={() => toggle(label)}
              disabled={isPending}
            >
              <View style={styles.contentRow}>
                <Text style={isOn ? styles.textOn : styles.textOff}>{label}</Text>
                <View style={styles.iconSpacer}>
                  <IconComp size={ICON_SIZE} color={iconColor} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </PaddingContainer>
  );
}
