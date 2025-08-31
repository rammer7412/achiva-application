
import { createArticle } from '@/api/post';
import ConfirmButton from '@/components/buttons/ArticleWriteButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import TitleWithBack from '@/components/header/TitleWithBack';
import ArticleCard from '@/components/screen/home/ArticleCard';
import { usePostDraftStore } from '@/stores/usePostDraftStore';
import type { Article, CreateArticleRequest, QA } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  View,
} from 'react-native';

type Page =
  | { type: 'title' }
  | { type: 'question'; data: QA }
  | { type: 'image' };

export default function PreviewCoverScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const category = usePostDraftStore((s) => s.category);
  const blocks   = usePostDraftStore((s) => s.blocks);
  const photoUri = usePostDraftStore((s) => s.photoUri);
  const reset    = usePostDraftStore((s) => s.reset);

  const [submitting, setSubmitting] = useState(false);
  const [listWidth, setListWidth] = useState(0);

  const qaList: QA[] = useMemo(() => {
    const arr = (blocks ?? []).map((b: any) => ({
      question: String(b?.title ?? b?.question ?? '').trim(),
      content : String(b?.text  ?? b?.content  ?? '').trim(),
    }));
    return arr.filter((q) => q.question.length > 0 || q.content.length > 0);
  }, [blocks]);

  const previewArticle: Article | null = useMemo(() => {
    if (!category || !photoUri || qaList.length === 0) return null;
    const nowIso = new Date().toISOString();
    return {
      id: -1,
      photoUrl: photoUri,
      title: '오늘의 성취',
      category,
      question: qaList,
      memberId: 0,
      memberNickName: 'me',
      memberProfileUrl: '',
      backgroundColor: '#f9f9f9',
      authorCategorySeq: qaList.length,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }, [category, photoUri, qaList]);

  const pages = useMemo<Page[]>(() => {
    if (!previewArticle) return [];
    return [
      { type: 'title' as const },
      ...previewArticle.question.map((q): Page => ({ type: 'question' as const, data: q })),
      { type: 'image' as const },
    ];
  }, [previewArticle]);

  const onListLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w && w !== listWidth) setListWidth(w);
  };

  const renderCard: ListRenderItem<Page> = ({ item: page, index }) => {
    if (!previewArticle) return null;
    return (
      <View style={{ width: listWidth || 0, aspectRatio: 1 }}>
        <ArticleCard
          item={previewArticle}
          index={index}
          total={pages.length}
          mode={page.type}
          question={page.type === 'question' ? page.data : undefined}
          style={{ flex: 1 }}
        />
      </View>
    );
  };

  const onShare = async () => {
    if (!previewArticle) {
      Alert.alert('알림', '미리볼 데이터가 부족합니다.');
      return;
    }

    const payload: CreateArticleRequest = {
      photoUrl: previewArticle.photoUrl,
      title: previewArticle.title,
      category: previewArticle.category,
      question: previewArticle.question,
      backgroundColor: previewArticle.backgroundColor,
    };

    try {
      setSubmitting(true);
      await createArticle(payload);
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
      Alert.alert('실패', e?.response?.data?.message || e?.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: scaleWidth(24) }}>
        <TitleWithBack title="표지 미리보기" />

        {/* 카드만 가로 스와이프(옆 카드 미노출, 정사각형) */}
        <View onLayout={onListLayout} style={{ marginTop: scaleHeight(12) }}>
          {previewArticle && pages.length > 0 ? (
            <FlatList<Page>
              horizontal
              pagingEnabled
              bounces={false}
              disableIntervalMomentum
              decelerationRate="fast"
              data={pages}
              renderItem={renderCard}
              keyExtractor={(_, idx) => String(idx)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{}}
            />
          ) : (
            <View style={{ height: scaleHeight(240) }} />
          )}
        </View>

        {/* 하단 버튼 */}
        <View style={{ marginTop: 'auto', marginBottom: scaleHeight(24) }}>
          <ConfirmButton
            text={submitting ? '업로드 중...' : '공유하기'}
            onPress={onShare}
            disabled={submitting || !previewArticle}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
