// components/screen/home/ArticleCard.tsx
import type { Article, Question } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  item: Article;
  index: number;
  total: number;
  mode: 'title' | 'question';
  question?: Question;
  style?: ViewStyle;
};

function formatDotDate(iso: string) {
  // 2025-08-06T... -> 2025.08.06
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  } catch {
    return iso?.slice(0, 10)?.replace(/-/g, '.') ?? '';
  }
}

export default function ArticleCard({ item, index, total, mode, question, style }: Props) {
  const { scaleWidth, scaleHeight, scaleFont, smartScale } = useResponsiveSize();

  const radius = smartScale(12, 16);
  const padH = scaleWidth(20);
  const padV = scaleHeight(22);
  const minH = scaleHeight(220);

  /** 공통 페이지 뱃지 */
  const PageBadge = () => (
    <View
      style={[
        styles.pageBadge,
        {
          paddingHorizontal: scaleWidth(10),
          paddingVertical: scaleHeight(4),
          borderRadius: smartScale(12, 14),
        },
      ]}
    >
      <Text style={[styles.pageBadgeText, { fontSize: scaleFont(11) }]}>
        {index + 1}/{total}
      </Text>
    </View>
  );

  // ───────────────────────────────────────────────────────────
  // 1) 대표(첫) 페이지: photo + overlay + 날짜/제목/카테고리
  // ───────────────────────────────────────────────────────────
  if (mode === 'title') {
    const HeaderBody = (
      <>
        <Text
          style={[
            styles.date,
            { fontSize: scaleFont(13), marginBottom: scaleHeight(12) },
          ]}
          numberOfLines={1}
        >
          {formatDotDate(item.createdAt)}
        </Text>

        <Text
          style={[
            styles.bigTitle,
            {
              fontSize: smartScale(28, 34),
              lineHeight: scaleHeight(40),
              marginBottom: scaleHeight(18),
            },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text
          style={[styles.sub, { fontSize: scaleFont(20), lineHeight: scaleHeight(28) }]}
          numberOfLines={2}
        >
          <Text style={styles.subEm}>{item.category}</Text> 기록{'\n'}1번째 이야기
        </Text>
      </>
    );

    if (item.photoUrl) {
      return (
        <ImageBackground
          source={{ uri: item.photoUrl }}
          resizeMode="cover"
          style={[
            styles.cardBase,
            { borderRadius: radius, backgroundColor: item.backgroundColor || '#000' },
            style,
          ]}
          imageStyle={{ borderRadius: radius }}
        >
          <View style={[styles.dim, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
          <View
            style={{
              paddingHorizontal: padH,
              paddingVertical: padV,
              minHeight: minH,
              justifyContent: 'center',
            }}
          >
            {HeaderBody}
          </View>
          <PageBadge />
        </ImageBackground>
      );
    }

    // photo 없을 때 단색 배경
    return (
      <View
        style={[
          styles.cardBase,
          { borderRadius: radius, backgroundColor: item.backgroundColor || '#151515' },
          style,
        ]}
      >
        <View
          style={{
            paddingHorizontal: padH,
            paddingVertical: padV,
            minHeight: minH,
            justifyContent: 'center',
          }}
        >
          {HeaderBody}
        </View>
        <PageBadge />
      </View>
    );
  }

  // ───────────────────────────────────────────────────────────
  // 2) 질문 페이지: 배경색 + 질문/내용
  // ───────────────────────────────────────────────────────────
  return (
    <View
      style={[
        styles.cardBase,
        { borderRadius: radius, backgroundColor: item.backgroundColor || '#F4F4F4' },
        style,
      ]}
    >
      <View
        style={{
          paddingHorizontal: padH,
          paddingVertical: padV,
          minHeight: minH,
          justifyContent: 'center',
        }}
      >
        <Text
          style={[
            styles.q,
            { fontSize: scaleFont(20), lineHeight: scaleHeight(28), marginBottom: scaleHeight(12) },
          ]}
          numberOfLines={2}
        >
          {question?.question ?? ''}
        </Text>

        {!!question?.content && (
          <Text
            style={[
              styles.c,
              { fontSize: scaleFont(14), lineHeight: scaleHeight(22) },
            ]}
            numberOfLines={5}
          >
            {question.content}
          </Text>
        )}
      </View>

      <PageBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  // 공통 카드 베이스
  cardBase: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },

  // 타이틀 페이지 텍스트
  date: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Pretendard-Medium',
  },
  bigTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Pretendard-ExtraBold',
  },
  sub: {
    color: 'white',
    fontFamily: 'Pretendard-Medium',
  },
  subEm: {
    fontFamily: 'Pretendard-ExtraBold',
    color: 'white',
  },

  // 질문 페이지 텍스트
  q: {
    color: '#111',
    fontFamily: 'Pretendard-ExtraBold',
  },
  c: {
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },

  // 페이지 뱃지
  pageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  pageBadgeText: {
    color: '#fff',
    fontFamily: 'Pretendard-SemiBold',
  },

  // 공통 dim overlay
  dim: {
    ...StyleSheet.absoluteFillObject,
  },
});
