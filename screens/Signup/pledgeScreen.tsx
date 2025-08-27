import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { BASE_URL } from '@/utils/apiClients';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';


type Slide = { id: string; heading: string; body: string };

const SLIDES: Slide[] = [
  { id: '1', heading: '우리의 공간', body: '성취를 나누고, 서로를 응원하는 새로운 공간\n당신의 작은 도전과 큰 성취가 모두 빛나는 곳\n이곳에서 우리는 함께 성장합니다' },
  { id: '2', heading: '성취를 공유해요', body: '나의 성취를 기록하고 공유하세요\n결과뿐 아니라 과정도 소중합니다\n작은 걸음 하나도 우리의 박수를 받을 자격이 있습니다' },
  { id: '3', heading: '서로를 응원해요', body: '칭찬과 격려는 우리의 언어입니다\n비판보다 격려를, 침묵보다 따뜻한 한마디를 선택합니다\n응원의 힘이 성취를 완성시킵니다' },
  { id: '4', heading: '함께 만들어요', body: '성취를 쌓아갑니다\n서로를 응원합니다\n\n아래 버튼을 눌러 Achiva의 문화에 참여하세요' },
];

export default function PledgeScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const [loading, setLoading] = useState(false);

  // 페이지 상태
  const [index, setIndex] = useState(0);
  const [listWidth, setListWidth] = useState(0);

  // 스와이프 제어용
  const listRef = useRef<FlatList<Slide>>(null);
  const dragStartXRef = useRef(0);
  const targetIndexRef = useRef(0);
  const isSnappingRef = useRef(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleNext = async () => {
    if (index !== SLIDES.length - 1 || loading) return;

    const {
      email, password, confirmPassword, nickname,
      profileImageUrl, birth, gender, region, categories,
    } = useUserSignupStore.getState();

    const payload = {
      email,
      password,
      confirmPassword,
      nickName: nickname,
      profileImageUrl: profileImageUrl || '',
      birth,
      gender: (gender || 'MALE').toUpperCase(),
      region: region || 'Seoul',
      categories,
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/auth/register`, payload, { headers: { 'Content-Type': 'application/json' } });
      router.replace('/signup/finishsignup');
    } catch (e: any) {
      Alert.alert('오류', e?.response?.data?.message || '회원가입 과정에서 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 개별 카드
  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View
      style={{
        width: listWidth || '100%',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#B77A77',
        paddingHorizontal: scaleWidth(18),
        paddingVertical: scaleHeight(24),
        height: scaleHeight(500),
        justifyContent: 'flex-start',
      }}
    >
      <Text style={{ marginTop: scaleHeight(94), fontSize: scaleFont(32), fontWeight: '800', fontFamily:'Pretendard-Variable', color: '#F4F2F2', marginBottom: scaleHeight(10) }}>
        {item.heading}
      </Text>
      <Text style={{ marginTop: scaleHeight(30), color: '#F4F2F2', fontSize: scaleFont(16), fontFamily:'Pretendard-Variable', lineHeight: scaleFont(22) }}>
        {item.body}
      </Text>
    </View>
  );

  const CARD_H = scaleHeight(500);

  const onListLayout = (e: any) => {
    const w = e?.nativeEvent?.layout?.width ?? 0;
    if (w && w !== listWidth) setListWidth(w);
  };

  // 한 장만 이동하도록 스냅
  const snapToIndex = (next: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, next));
    targetIndexRef.current = clamped;
    isSnappingRef.current = true;
    setScrollEnabled(false);
    setIndex(clamped);
    listRef.current?.scrollToIndex({ index: clamped, animated: true });
  };

  const onBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragStartXRef.current = e.nativeEvent.contentOffset.x;
    isSnappingRef.current = false;
    targetIndexRef.current = index;
  };

  const onEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const endX = e.nativeEvent.contentOffset.x;
    const dx = endX - dragStartXRef.current;
    const threshold = (listWidth || 1) * 0.15; // 15% 넘기면 이동

    if (Math.abs(dx) < threshold) {
      snapToIndex(index);                // 스냅백
    } else {
      snapToIndex(index + (dx > 0 ? 1 : -1)); // 이웃 페이지만
    }
  };

  const onMomentumEnd = () => {
    // 최종 보정 + 스크롤 잠금 해제
    if (isSnappingRef.current) {
      listRef.current?.scrollToIndex({ index: targetIndexRef.current, animated: false });
    }
    isSnappingRef.current = false;
    setScrollEnabled(true);
  };

  // ✅ 타입 정의에 맞는 시그니처로 수정 (offset 없음)
  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    // averageItemLength 또는 이미 측정된 listWidth로 보정해 이동
    const w = listWidth || info.averageItemLength || 1;
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: w * info.index, animated: true });
    }, 0);
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingHorizontal: scaleWidth(24), backgroundColor: '#fff' }}>
        <HeaderWithBack total={6} current={5} />

        <NoticeMessageTitle
          message="Achiva 문화에 참여해요"
          subtitle="게시물을 오른쪽으로 넘겨 다음 내용을 볼 수 있어요"
        />

        {/* 카드 영역 */}
        <View style={{ position: 'relative', height: CARD_H }} onLayout={onListLayout}>
          {/* 고정 배지 */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: scaleWidth(8),
              top: scaleHeight(8),
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderRadius: 16,
              paddingVertical: scaleHeight(2),
              paddingHorizontal: scaleWidth(8),
            }}
          >
            <Text style={{ color: '#fff', fontSize: scaleFont(11), fontWeight: '700' }}>
              {index + 1}/{SLIDES.length}
            </Text>
          </View>

          <FlatList
            ref={listRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SLIDES}
            keyExtractor={(s) => s.id}
            renderItem={renderItem}
            style={{ height: CARD_H }}
            scrollEnabled={scrollEnabled}
            disableIntervalMomentum
            onScrollBeginDrag={onBeginDrag}
            onScrollEndDrag={onEndDrag}
            onMomentumScrollEnd={onMomentumEnd}
            getItemLayout={
              listWidth
                ? (_, i) => ({ length: listWidth, offset: listWidth * i, index: i })
                : undefined
            }
            onScrollToIndexFailed={onScrollToIndexFailed} // ← 타입 맞춤
            initialNumToRender={1}
            removeClippedSubviews
            scrollEventThrottle={16}
          />
        </View>

        <View style={{ marginTop: 'auto', marginBottom: scaleHeight(80) }}>
          <ConfirmButton
            text={loading ? '가입 중...' : '동의하고 시작하기'}
            onPress={handleNext}
            disabled={loading || index !== SLIDES.length - 1}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
