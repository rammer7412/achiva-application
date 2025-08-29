import type { CreateArticleRequest } from '@/api/post';
import { createArticle } from '@/api/post';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import TitleWithBack from '@/components/header/TitleWithBack';
import { usePostDraftStore } from '@/stores/usePostDraftStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PreviewCover() {
  const router = useRouter();
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  const category  = usePostDraftStore(s => s.category);
  const blocks    = usePostDraftStore(s => s.blocks);

  const photoUri  = usePostDraftStore(s => s.photoUri);
  const reset     = usePostDraftStore(s => s.reset);

  const [submitting, setSubmitting] = useState(false);

  const cardSize = useMemo(() => ({
    width: '100%',
    height: scaleHeight(260),
    radius: 10,
  }), [scaleHeight]);

  const todayText = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  }, []);

  const onShare = async () => {
    if (!category) {
      Alert.alert('알림', '카테고리가 없습니다. 처음부터 다시 시도해주세요.');
      return;
    }
    if (!blocks?.length) {
      Alert.alert('알림', '작성한 내용이 없습니다.');
      return;
    }
    if (!photoUri) {
      Alert.alert('알림', '사진이 선택되지 않았습니다.');
      return;
    }

    const qa = blocks
      .map((b: any) => ({
        question: String(b?.question ?? '').trim(),
        content : String(b?.content  ?? '').trim(),
      }))
      .filter(q => q.question.length > 0 || q.content.length > 0);

    if (qa.length === 0) {
      Alert.alert('알림', '질문/내용이 비어 있습니다.');
      return;
    }

    const payload: CreateArticleRequest = {
      photoUrl: photoUri,
      title: '오늘의 성취',          // 필요하면 상태/입력값으로 교체
      category,                      // store에서 가져온 카테고리
      question: qa,                  // 위에서 변환한 QA[]
      backgroundColor: '#f9f9f9',    // 선택값이 있으면 교체/삭제
    };

    try {
      setSubmitting(true);
      const created = await createArticle(payload);
      console.log(created);
      Alert.alert('완료', '게시글이 업로드되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            router.dismissTo('/post');
            requestAnimationFrame(() => {
              router.replace('/(tab)/home');
              setTimeout(() => reset(), 0);
            });
          },
        },
      ]);
    } catch (e: any) {
      if (__DEV__) console.log('[PreviewCover] 공유 실패:', e?.message);
      Alert.alert('실패', e?.response?.data?.message || e?.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: scaleWidth(24) }}>
        <TitleWithBack title="표지 미리보기" />

        {/* 카드 미리보기 (배경 = 선택한 사진) */}
        <ImageBackground
          source={photoUri ? { uri: photoUri } : undefined}
          resizeMode="cover"
          imageStyle={{ borderRadius: cardSize.radius }}
          style={{
            width: '100%',
            height: cardSize.height,
            borderRadius: cardSize.radius,
            overflow: 'hidden',
            marginTop: scaleHeight(8),
            justifyContent: 'flex-end',
          }}
        >
          {/* 어두운 오버레이 + 텍스트 */}
          <View
            style={{
              ...(StyleSheet as any).absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          />
          <View style={{ paddingHorizontal: scaleWidth(14), paddingVertical: scaleHeight(12) }}>
            <Text style={{ color: '#fff', opacity: 0.85, fontSize: scaleFont(11), marginBottom: scaleHeight(6) }}>
              {todayText}
            </Text>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: scaleFont(22) }}>
              오늘의 성취
            </Text>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: scaleFont(14), marginTop: scaleHeight(4) }}>
              공부 기록 15번째 이야기
            </Text>
          </View>
        </ImageBackground>

        <View style={{ marginTop: 'auto', marginBottom: scaleHeight(36) }}>
          <ConfirmButton
            text={submitting ? '업로드 중...' : '공유하기'}
            onPress={onShare}
            disabled={submitting || !photoUri}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
