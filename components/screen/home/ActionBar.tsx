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

import { createCheering, deleteCheering } from '@/api/cheering';
import type { CategoryKeyKr, CreateCheeringPayload } from '@/types/ApiTypes';
import type { Cheering } from '@/types/Response';

type Props = {
  actions?: CategoryKeyKr[]; // 한국어 라벨
  style?: ViewStyle;
  /** (label, isOn) */
  onPressAction?: (label: CategoryKeyKr, isOn: boolean) => void;
  /** 최초에 켜둘 라벨들 */
  initialSelected?: CategoryKeyKr[];
  /** 최초 응원 객체(삭제를 위해 id까지 전달하고 싶을 때) */
  initialCheerings?: Partial<Record<CategoryKeyKr, Cheering>>;
  /** 대상 게시글 ID */
  articleId: number;
  /** 생성 성공 시 콜백 */
  onCheeringCreated?: (cheering: Cheering, label: CategoryKeyKr) => void;
  /** 삭제 성공 시 콜백 */
  onCheeringDeleted?: (label: CategoryKeyKr) => void;
  /** 라벨별 커스텀 content(미지정 시 라벨 그대로 전송) */
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

  const [selectedSet, setSelectedSet] = React.useState<Set<CategoryKeyKr>>(
    () => new Set(initialSelected),
  );

  // 버튼별 진행 중 보호
  const [pendingSet, setPendingSet] = React.useState<Set<CategoryKeyKr>>(
    () => new Set(),
  );

  // 라벨 -> Cheering 객체(삭제용 id 저장)
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

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: scaleWidth(4),
        },
        btnBase: {
          paddingVertical: scaleHeight(8),
          paddingHorizontal: scaleWidth(10),
          borderRadius: 36,
          borderWidth: scaleWidth(1.2),
        },
        btnOn: { backgroundColor: '#412A2A', borderColor: '#412A2A' },
        btnOff: { backgroundColor: '#FFFFFF', borderColor: '#412A2A' },
        contentRow: { flexDirection: 'row', alignItems: 'center' },
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
        iconSpacer: { marginLeft: scaleWidth(8) },
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

    // Optimistic 토글
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
        // ON → 응원 생성
        const payload: CreateCheeringPayload = {
          content: (contentMap?.[label] ?? label).trim(),
          cheeringCategory: label, // 한국어 그대로
        };
        const cheering = await createCheering(articleId, payload);
        setCheeringMap((prev) => {
          const next = new Map(prev);
          next.set(label, cheering);
          return next;
        });
        onCheeringCreated?.(cheering, label);
      } else {
        // OFF → 응원 삭제
        const cheering = cheeringMap.get(label);
        if (!cheering?.id) {
          // 초기 상태에서 id를 모르면 삭제 불가 → 안내
          throw new Error('NO_CHEERING_ID');
        }
        await deleteCheering(articleId, cheering.id);
        setCheeringMap((prev) => {
          const next = new Map(prev);
          next.delete(label);
          return next;
        });
        onCheeringDeleted?.(label);
      }
    } catch (e: any) {
      // 실패 → 상태 롤백
      setSelectedSet((prev) => {
        const next = new Set(prev);
        if (isCurrentlyOn) next.add(label);
        else next.delete(label);
        return next;
      });
      onPressAction?.(label, isCurrentlyOn);

      const msg = String(e?.message || '');
      let userMsg = '잠시 후 다시 시도해 주세요.';
      if (msg.includes('NO_CHEERING_ID')) {
        userMsg = '취소할 응원 정보를 찾지 못했어요.';
      }
      console.log('[cheering:toggle:error]', msg);
      Alert.alert('응원 처리 실패', userMsg);
    } finally {
      setPendingSet((p) => {
        const n = new Set(p);
        n.delete(label);
        return n;
      });
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
