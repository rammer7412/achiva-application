import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import { BackHeader } from '@/components/header/BackHeader';
import CheckCircle from '@/components/icons/CheckCircle';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { usePostDraftStore } from '@/stores/usePostDraftStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { editorHref } from '@/utils/routes';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

const PALETTE = ['#FFFFFF', '#000000', '#543535', '#B77A77', '#515C84', '#566C52'];

export default function ChooseColorScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const cardColor     = usePostDraftStore(s => (s as any).cardColor ?? null);
  const setCardColor  = usePostDraftStore(s => (s as any).setCardColor as (c: string|null)=>void);

  const [selected, setSelected] = useState<string | null>(cardColor);

  const tiles = useMemo(() => PALETTE.map((c, i) => ({ id: String(i), color: c })), []);

  const TILE_SIZE = scaleWidth(114);

  const handleNext = () => {
    if (!selected) return;
    setCardColor(selected);
    router.push(editorHref(0));
  };

  return (
    <ScreenContainer>
      <View style={{ flex:1, backgroundColor:'#fff', paddingHorizontal: scaleWidth(24) }}>
        <BackHeader onPressBack={() => router.back()} />
        <NoticeMessageTitle message="배경색을 선택해주세요" />

        <View
          style={{
            marginTop: scaleHeight(16),
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: scaleWidth(15),
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          {tiles.map(t => {
            const isSel = selected === t.color;
            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.85}
                onPress={() => setSelected(t.color)}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  borderRadius: 12,
                  backgroundColor: t.color,
                  borderWidth: isSel ? 3 : 1,
                  borderColor: isSel ? '#442727' : '#E0E0E0',
                  shadowOpacity: isSel ? 0.15 : 0,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: isSel ? 3 : 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isSel && (
                  <CheckCircle
                    size={scaleWidth(32)}
                    color={t.color === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: 'auto', marginBottom: scaleHeight(36) }}>
          <ConfirmButton text="다음" onPress={handleNext} disabled={!selected} />
        </View>
      </View>
    </ScreenContainer>
  );
}
