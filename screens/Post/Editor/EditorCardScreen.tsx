// @/screens/Post/Editor/EditorCardScreen.tsx
import HeaderWithBack from '@/components/HeaderWithBack';
import ScreenContainer from '@/components/ScreenContainer';
import { usePostDraftStore } from '@/stores/usePostDraftStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { editorHref } from '@/utils/routes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MAX_LEN = 500;

export default function EditorCardScreen() {
  const router = useRouter();
  const { index: _idx } = useLocalSearchParams<{ index?: string }>();
  const idx = Math.max(0, Number(_idx ?? 0));

  const { scaleWidth, scaleHeight, scaleFont, safeArea } = useResponsiveSize();

  const category   = usePostDraftStore((s) => s.category);
  const blocks     = usePostDraftStore((s) => s.blocks);
  const updateBlock= usePostDraftStore((s) => s.updateBlock);
  const resetDraft = usePostDraftStore((s) => s.reset);
  const addBlock   = usePostDraftStore((s) => s.addBlock);
  const cardColor  = usePostDraftStore((s) => (s as any).cardColor);

  const total = blocks.length;
  const block = blocks[idx];

  const goPrevCard = () => idx > 0 && router.replace(editorHref(idx - 1));
  const goNextCard = () => idx < total - 1 && router.replace(editorHref(idx + 1));

  const [localTitle, setLocalTitle] = useState(block?.title ?? '');
  const [localText,  setLocalText ] = useState(block?.text ?? '');
  const [submitting, setSubmitting] = useState(false); // 유지(우측 버튼 disabled와 호환)

  const finishingRef = useRef(false);

  useEffect(() => {
    const invalid = !block || total === 0 || Number.isNaN(idx) || idx < 0 || idx >= total;
    if (invalid && !finishingRef.current) {
      router.replace({ pathname: '/post/choosecontents' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block, total, idx]);

  useEffect(() => {
    if (block) {
      setLocalTitle(block.title ?? '');
      setLocalText(block.text ?? '');
    }
  }, [block?.id]);

  if (!block || total === 0 || Number.isNaN(idx) || idx < 0 || idx >= total) return null;

  const persistCurrentCard = () => {
    if (__DEV__)
      console.log('[EditorCard] persist card', {
        idx,
        id: block.id,
        titleLen: localTitle.length,
        textLen: localText.length,
      });
    updateBlock(block.id, { title: localTitle, text: localText });
  };

  const addBlankPage = () => {
    persistCurrentCard();
    addBlock('text');
    router.replace(editorHref(total));
  };

  // 마지막 카드에서 업로드 대신 AddPhotoScreen으로 이동
  const saveAndNextOrFinish = async () => {
    if (__DEV__) console.log('[EditorCard] saveAndNextOrFinish start', { idx, total, category, submitting });
    persistCurrentCard();

    if (idx < total - 1) {
      if (__DEV__) console.log('[EditorCard] -> goNextCard');
      goNextCard();
      return;
    }

    // ✅ 마지막 카드 → 사진 추가 화면으로 이동
    if (__DEV__) console.log('[EditorCard] -> go AddPhotoScreen');
    router.push('/post/editor/addphoto');
  };

  const previewBg = cardColor || '#B77A77';
  const previewFg = '#F4F2F2';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={safeArea.top}
      >
        <HeaderWithBack
          total={total}
          current={idx + 1}
          showSeparator={false}
          rightButton={{ label: '다음', onPress: saveAndNextOrFinish, disabled: submitting }}
        />

        <View style={{ flex: 1, paddingHorizontal: scaleWidth(30), paddingTop: scaleHeight(10) }}>
          {/* ===== 카드 미리보기 (제목/내용 입력) ===== */}
          <View
            style={{
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              backgroundColor: previewBg,
              paddingHorizontal: scaleWidth(18),
              paddingVertical: scaleHeight(85),
              height: scaleHeight(500),
              gap: 9.07,
            }}
          >
            {/* 우상단 현재/전체 뱃지 */}
            <View
              style={{
                position: 'absolute',
                right: scaleWidth(18),
                top: scaleHeight(18),
                backgroundColor: 'rgba(0,0,0,0.25)',
                borderRadius: 16,
                paddingVertical: scaleHeight(2),
                paddingHorizontal: scaleWidth(8),
              }}
            >
              <Text style={{ color: '#fff', fontSize: scaleFont(11), fontWeight: '700' }}>
                {idx + 1}/{total}
              </Text>
            </View>

            {/* 제목 */}
            <TextInput
              value={localTitle}
              onChangeText={setLocalTitle}
              placeholder="제목을 입력하세요"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={{
                fontSize: scaleFont(20),
                fontWeight: '800',
                color: previewFg,
                paddingVertical: scaleHeight(6),
              }}
            />

            <View style={{ height: scaleHeight(8) }} />

            {/* 내용 */}
            <TextInput
              value={localText}
              onChangeText={setLocalText}
              placeholder="내용을 자유롭게 작성해주세요"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={{
                minHeight: scaleHeight(120),
                color: previewFg,
                fontSize: scaleFont(13),
                lineHeight: scaleFont(19),
                textAlignVertical: 'top',
              }}
              multiline
              maxLength={MAX_LEN}
            />
          </View>

          {/* 빈 페이지 추가하기 */}
          <View style={{ marginTop: scaleHeight(12) }}>
            <TouchableOpacity
              onPress={addBlankPage}
              activeOpacity={0.85}
              style={{
                alignSelf: 'flex-start',
                paddingVertical: scaleHeight(6),
                paddingHorizontal: scaleWidth(10),
                borderWidth: 1,
                borderColor: '#D9D9D9',
                borderRadius: 6,
                backgroundColor: '#fff',
              }}
            >
              <Text style={{ fontSize: scaleFont(13), color: '#2B2B2B', fontWeight: '600' }}>
                빈 페이지 추가하기
              </Text>
            </TouchableOpacity>
          </View>

          {/* 하단 로딩 오버레이(현재는 사용 없음이지만 유지) */}
          {submitting && (
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: scaleHeight(16), alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
