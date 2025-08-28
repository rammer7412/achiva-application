// @/screens/Post/ChooseContentsScreen.tsx
import ScreenContainer from '@/components/ScreenContainer';
import TitleWithBack from '@/components/TitleWithBack';
import SmallBox from '@/components/boxes/SmallBox';
import ConfirmButton from '@/components/buttons/ConfirmButton';

import CheckIcon from '@/components/icons/CheckIcon'; // ★ 추가
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
  '운동': ['오늘 운동 루틴 요약', '힘들지만 해낸 동작', '컨디션 체크 기록', '운동하며 떠오른 메모'],
  '공부': ['오늘 공부 루틴 요약', '어려웠던 개념', '학습 체크 기록', '공부하며 떠오른 메모', '오늘 공부하며 든 생각'],
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
    // 👇 바로 에디터가 아니라 색상 선택 화면으로 이동
    router.push('/post/choosecolor');
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
          <Text numberOfLines={1} style={{ fontSize: scaleFont(15), color: '#2B2B2B', fontWeight: '500' }}>
            {item.label}
          </Text>
        </TouchableOpacity>

        {/* ★ 항상 체크 아이콘을 표시: 선택됨=갈색, 미선택=회색 */}
        <View style={{ width: scaleFont(18), height: scaleFont(18), alignItems: 'center', justifyContent: 'center' }}>
          <CheckIcon focused={isSelected} />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingHorizontal: scaleWidth(24), backgroundColor: '#fff' }}>
        <TitleWithBack showTitle={false} showSeparator={false} />
        <NoticeMessageTitle message="작성할 내용들을 선택해주세요" />

        {/* 카테고리 뱃지 */}
        {category ? (
          <View style={{ marginTop: scaleHeight(15), marginBottom: scaleHeight(50), flexDirection: 'row', alignItems: 'center' }}>
            <SmallBox text={category} selected style={{ marginBottom: 0 }} />
          </View>
        ) : null}

        {/* 드래그 리스트 */}
        <View style={{ marginTop: scaleHeight(18) }}>
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

        {/* 하단 고정 바 */}
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: (safeArea?.bottom ?? 0),
            paddingHorizontal: scaleWidth(24),
            paddingTop: scaleHeight(8),
            paddingBottom: scaleHeight(4),
            backgroundColor: '#fff',
            borderTopWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          }}
        >
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
            <Text
              style={{
                textAlign: 'center',
                marginTop: scaleHeight(8),
                fontSize: scaleFont(12),
                color: selectedIds.length >= MAX_BLOCKS ? '#D54A4A' : '#8D7B77',
              }}
            >
              {selectedIds.length}/{MAX_BLOCKS}
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
