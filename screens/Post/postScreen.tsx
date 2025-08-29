// @/screens/Main/PostScreen.tsx
import ConfirmButton from '@/components/buttons/ConfirmButton';
import { SmallButton } from '@/components/buttons/SmallButton';
import { FlexPaddingContainer } from '@/components/containers/ScreenContainer';
import { XHeader } from '@/components/header/XHeader';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { usePostDraftStore } from '@/stores/usePostDraftStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORIES = ['공부','운동','커리어','독서','자기계발','취미','투자','루틴','마인드셋'];

export default function PostScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  const setCategory = usePostDraftStore(s => s.setCategory);
  const reset = usePostDraftStore(s => s.reset);

  const [selected, setSelected] = useState<string | null>(null);
  const [exitOpen, setExitOpen] = useState(false); // ✨ 종료 확인 모달

  const handleNext = () => {
    if (!selected) return;
    reset();               // 이전 초안 초기화
    setCategory(selected); // 선택 반영
    router.push('/post/choosecontents');
  };

  const handleDiscard = () => {
    reset();
    setExitOpen(false);
    router.replace('/home' as any);
  };

  return (
    <FlexPaddingContainer>
      <XHeader onPressClose={() => setExitOpen(true)} />
      <View style={{ flex:0.8, backgroundColor: '#fff' }}>

        <NoticeMessageTitle message="작성할 성취 카테고리를 선택해주세요" />

        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: scaleWidth(8), marginLeft: scaleWidth(8), marginVertical: scaleHeight(20) }}>
          {CATEGORIES.map((item) => {
            const isSelected = selected === item;
            return (
              <SmallButton
                key={item}
                text={item}
                selected={isSelected}
                onPress={() => setSelected(prev => (prev === item ? null : item))}
              />
            );
          })}
        </View>    
      </View>

      <View style={{flex: 0.1}}>
          <ConfirmButton text="다음" onPress={handleNext} disabled={!selected} />
      </View>

      <Modal
        visible={exitOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setExitOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleWidth(24),
          }}
          onPress={() => setExitOpen(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 360,
              backgroundColor: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <View style={{ paddingVertical: scaleHeight(18), alignItems: 'center', paddingHorizontal: scaleWidth(12) }}>
              <Text style={{ fontSize: scaleFont(16), fontWeight: '700', color: '#2B2B2B' }}>
                글쓰기를 중단하시겠어요?
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: '#EFEFEF' }} />

            <TouchableOpacity
              onPress={handleDiscard}
              activeOpacity={0.8}
              style={{ paddingVertical: scaleHeight(14), alignItems: 'center' }}
            >
              <Text style={{ fontSize: scaleFont(15), fontWeight: '600', color: '#D54A4A' }}>
                삭제
              </Text>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: '#EFEFEF' }} />

            <TouchableOpacity
              onPress={() => setExitOpen(false)}
              activeOpacity={0.8}
              style={{ paddingVertical: scaleHeight(14), alignItems: 'center' }}
            >
              <Text style={{ fontSize: scaleFont(15), fontWeight: '600', color: '#2B2B2B' }}>
                계속 수정하기
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </FlexPaddingContainer>
  );
}
