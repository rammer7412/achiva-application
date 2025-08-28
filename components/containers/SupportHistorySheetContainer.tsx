// components/screen/profile/SupportHistorySheetContainer.tsx
import SupportHistorySheet from '@/components/screen/profile/SupportHistorySheet';
import { useSupportStats } from '@/hooks/useSupportStats';
import { useAuthStore } from '@/stores/useAuthStore'; // 경로 맞춰주세요
import React from 'react';

type Variant = 'received' | 'sent';

type Props = {
  visible: boolean;
  onClose: () => void;
  userName: string;
  variant: Variant;
  memberId?: number; // 타인 프로필이면 넘김, 없으면 내 id 사용
};

export default function SupportHistorySheetContainer({
  visible,
  onClose,
  userName,
  variant,
  memberId,
}: Props) {
  const myId = useAuthStore((s) => s.user?.id); // ← 스토어에서 바로
  const targetId = memberId ?? myId ?? null;

  const { loading, buttonStats, totalPoints } = useSupportStats(variant, {
    enabled: visible && !!targetId,
    memberId: targetId,
  });

  return (
    <SupportHistorySheet
      visible={visible}
      onClose={onClose}
      userName={userName}
      variant={variant}
      totalPoints={totalPoints}
      buttonStats={buttonStats}
    />
  );
}
