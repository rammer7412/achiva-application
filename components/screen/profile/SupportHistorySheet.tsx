// components/screen/profile/SupportHistorySheet.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { ScrollView, View } from 'react-native';
import SupportButtonsCard, { ButtonStat } from './support/SupportButtonsCard';
import SupportHeader from './support/SupportHeader';
import SupportPointsSummary from './support/SupportPointsSummary';
import SupportSectionTitle from './support/SupportSectionTitle';
import SupportSheet from './support/SupportSheet';

type Variant = 'received' | 'sent';

type Props = {
  visible: boolean;
  onClose: () => void;
  userName: string;
  totalPoints?: number;
  buttonStats?: ButtonStat[];
  variant: Variant; 
};

export default function SupportHistorySheet({
  visible,
  onClose,
  userName,
  totalPoints = 0,
  buttonStats = [],
  variant = 'received',
}: Props) {
  const { scaleHeight } = useResponsiveSize();

  const copy =
    variant === 'received'
      ? { pointsTitle: '받은 응원 포인트', buttonsTitle: '받은 응원 버튼' }
      : { pointsTitle: '보낸 응원 포인트', buttonsTitle: '보낸 응원 버튼' };

  return (
    <SupportSheet visible={visible} onClose={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scaleHeight(28), gap: scaleHeight(18) }}
      >
        <SupportHeader userName={userName} onClose={onClose} />

        <SupportSectionTitle>{copy.pointsTitle}</SupportSectionTitle>
        <SupportPointsSummary points={totalPoints} />
        <View style={{ marginVertical: scaleHeight(24)}}/>
        <SupportSectionTitle>{copy.buttonsTitle}</SupportSectionTitle>
        <SupportButtonsCard items={buttonStats} />
        <View style={{ marginVertical: scaleHeight(96)}}/>
      </ScrollView>
    </SupportSheet>
  );
}
