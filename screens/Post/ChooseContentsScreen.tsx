import SmallBox from '@/components/boxes/SmallBox';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import { FlexPaddingContainer } from '@/components/containers/ScreenContainer';
import { BackHeader } from '@/components/header/BackHeader';
import CheckIcon from '@/components/icons/CheckIcon';
import DotSixVertical from '@/components/icons/DotSixVertical';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { usePostDraftStore } from '@/stores/usePostDraftStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Pressable, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

const MAX_BLOCKS = 10;
const MIN_BLOCKS = 1;

const CATEGORY_TEMPLATES: Record<string, string[]> = {
  '운동': ['오늘 운동한 내용 정리', '운동 중 느낀 난이도', '몸 상태와 컨디션', '변화 기록', '다음 운동 계획', '운동하며 떠오른 메모'],
  '공부': ['오늘 공부한 내용 정리', '이해가 어려웠던 부분', '외워야 할 핵심 요약', '공부 진행 상황', '내일 공부 계획', '오늘 공부하며 든 생각'],
  '독서': ['오늘 읽은 책과 저자', '기억에 남는 문장', '오늘 읽은 분량', '책에서 얻은 인사이트', '읽으면서 든 생각', '다음 독서 계획'],
  '커리어': ['오늘 진행한 주요 업무', '현재 커리어에 대한 생각', '업무 중 새로 배운 점', '어려웠던 문제와 원인', '해결 방법', '향후 커리어 계획'],
  '루틴': ['오늘 지킨 습관', '성공·실패 요인', '루틴에서 느낀 점', '개선할 부분', '내일 루틴 계획', '의지를 다지는 한 마디'],
  '마인드셋': ['오늘 정리한 생각 하나', '감사했던 일', '놓지고 싶지 않은 관점', '힘들었던 순간', '극복 방법', '내일의 마음가짐'],
  '투자': ['오늘 투자 내용', '수익·손실 요약', '투자 판단 근거', '오늘 본 시장 흐름', '다음 투자 계획', '투자 마인드셋'],
  '자기계발': ['오늘 도전한 활동', '참고한 자료', '새로 익힌 기술·지식', '실행하며 느낀 점', '개선하고 싶은 점', '다음 실행 계획'],
  '취미': ['오늘 한 취미 활동', '오늘의 결과 기록', '만족스러웠던 포인트', '어려웠던 부분', '개선 아이디어', '다음 시도 계획'],
};

type Item = { id: string; label: string; isCustom?: boolean };
const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export default function ChooseContentsScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont, safeArea } = useResponsiveSize();

  const category = usePostDraftStore((s) => s.category);
  const setBlocks = usePostDraftStore((s) => s.setBlocks);

  const [data, setData] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const listRef = useRef<any>(null);

  const winH = Dimensions.get('window').height;
  const LIST_MIN_H = scaleHeight(160);
  const LIST_MAX_H = Math.max(scaleHeight(260), Math.round(winH * 0.42));

  useEffect(() => {
    const presets = (CATEGORY_TEMPLATES[category ?? ''] ?? []).map<Item>((label, idx) => ({
      id: `preset::${category}::${idx}`,
      label,
    }));
    setData(presets);
    setSelectedIds([]);
  }, [category]);

  const isMax = selectedIds.length >= MAX_BLOCKS;

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_BLOCKS) {
        Alert.alert('알림', `본문은 최대 ${MAX_BLOCKS}개까지 선택할 수 있어요.`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleAddCustom = () => {
    if (isMax) {
      Alert.alert('알림', `본문은 최대 ${MAX_BLOCKS}개까지 선택할 수 있어요.`);
      return;
    }
    const item: Item = {
      id: `custom::${makeId()}`,
      label: `직접 입력 ${data.filter(d => d.isCustom).length + 1}`,
      isCustom: true,
    };
    setData((prev) => {
      const next = [...prev, item];
      setTimeout(() => {
        if (listRef.current?.scrollToEnd) {
          listRef.current.scrollToEnd({ animated: true });
        } else if (listRef.current?.scrollToIndex) {
          listRef.current.scrollToIndex({ index: next.length - 1, animated: true });
        }
      }, 0);
      return next;
    });
    setSelectedIds((prev) => [...prev, item.id]);
  };

  const handleSave = () => {
    if (selectedIds.length < MIN_BLOCKS) return;
    const orderedSelected = data.filter((it) => selectedIds.includes(it.id));
    const blocks = orderedSelected.map((it) => ({
      id: makeId(),
      type: 'text' as const,
      title: it.label,
      text: '',
    }));
    setBlocks(blocks);

    router.push('/(tab)/post/choosecolor');
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: isActive ? '#C8B9B6' : '#E0E0E0',
          borderRadius: 8,
          paddingVertical: scaleHeight(6),
          paddingHorizontal: scaleWidth(12),
          backgroundColor: isActive ? '#F7F4F3' : '#FFF',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable
          onLongPress={drag}
          onPressIn={drag}
          hitSlop={6}
          style={{ paddingLeft: scaleWidth(0), marginRight: scaleWidth(4), padding: scaleWidth(2) }}
        >
          <DotSixVertical focused={isActive || isSelected} />
        </Pressable>

        <TouchableOpacity onPress={() => toggle(item.id)} style={{ flex: 1 }} activeOpacity={0.7}>
          <Text numberOfLines={1} style={{ fontFamily: 'Pretendard-Medium', fontSize: scaleFont(15), color: '#2B2B2B', fontWeight: '500' }}>
            {item.label}
          </Text>
        </TouchableOpacity>

        <View style={{ width: scaleFont(18), height: scaleFont(18), alignItems: 'center', justifyContent: 'center' }}>
          <CheckIcon focused={isSelected} />
        </View>
      </View>
    );
  };

  return (
    <FlexPaddingContainer>
      <BackHeader onPressBack={() => router.back()} />

      <NoticeMessageTitle message="작성할 내용들을 선택해주세요" />

      {category ? (
          <View style={{ marginTop: scaleHeight(15), marginBottom: scaleHeight(50), flexDirection: 'row', alignItems: 'center' }}>
            <SmallBox text={category} selected style={{ marginBottom: 0 }} />
          </View>
        ) : null}

      <View style={{ marginTop: scaleHeight(18), marginBottom: scaleHeight(4)}}>
        <DraggableFlatList
          ref={listRef}
          data={data}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setData(data)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: scaleHeight(10) }} />}
          style={{ height: LIST_MAX_H, minHeight: LIST_MIN_H }}
          contentContainerStyle={{ paddingBottom: safeArea.bottom + scaleHeight(120) }}
          autoscrollThreshold={scaleHeight(32)}
          autoscrollSpeed={350}
        />
      </View>

      <TouchableOpacity onPress={handleAddCustom} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="add" size={scaleFont(25)} color="#2B2B2B" />
          <Text
            style={{
              marginLeft: scaleWidth(6),
              fontSize: scaleFont(20),
              color: '#2B2B2B',
              fontFamily: 'Pretendard-Variable',
            }}
          >
            직접 입력
          </Text>
        </TouchableOpacity>

      <View style={{ marginTop: scaleHeight(18) }}>
        <ConfirmButton text="다음" onPress={handleSave} disabled={selectedIds.length < MIN_BLOCKS} />
          
        </View>
    </FlexPaddingContainer>
  );
}
