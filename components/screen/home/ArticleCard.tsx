// components/screen/home/ArticleCard.tsx
import type { Article, Question } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  item: Article;
  index: number;
  total: number;
  mode: 'title' | 'question' | 'image';
  question?: Question;
  imageUrl?: string; // 필요 시 외부 이미지 지정 가능(없으면 item.photoUrl 사용)
  style?: ViewStyle;
};

function formatDotDate(iso: string) {
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

export default function ArticleCard({
  item,
  index,
  total,
  mode,
  question,
  imageUrl,
  style,
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont, smartScale } = useResponsiveSize();

  const radius = smartScale(0,0);
  const padH = scaleWidth(20);
  const padV = scaleHeight(22);
  const minH = scaleHeight(220);

  /** 우상단 페이지 뱃지 */
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
      <Text style={[styles.pageBadgeText, { fontSize: scaleFont(15) }]}>
        {index + 1}/{total}
      </Text>
    </View>
  );

  // ─ 1) 대표(첫) 페이지: 이미지 + 오버레이 + 날짜/제목/카테고리
  if (mode === 'title') {
    const HeaderBody = (
      <View style={{flex:1, justifyContent: 'center'}}>
        <Text
          style={[styles.date, { fontSize: scaleFont(32), marginBottom: scaleHeight(8) }]}
          numberOfLines={1}
        >
          {formatDotDate(item.createdAt)}
        </Text>

        <Text
          style={[
            styles.bigTitle,
            { fontSize: scaleFont(64), marginBottom: scaleHeight(48) },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text style={[styles.sub, { fontSize: scaleFont(48)}]} numberOfLines={2}>
          <Text style={styles.subEm}>{item.category}</Text> 기록{'\n'}
          <Text style={styles.subEm}>{item.authorCategorySeq}번째</Text> 이야기
        </Text>
      </View>
    );

    if (item.photoUrl) {
      return (
        <ImageBackground
          source={{ uri: item.photoUrl }}
          resizeMode="cover"
          style={[styles.cardBase, { borderRadius: radius, backgroundColor: item.backgroundColor || '#000' }, style]}
          imageStyle={{ borderRadius: radius }}
        >
          <View style={[styles.dim, { backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center' }]}>
            <View style={{ paddingHorizontal: padH, paddingVertical: padV, minHeight: minH, justifyContent: 'center' }}>
              {HeaderBody}
            </View>
          </View>
          <PageBadge />
        </ImageBackground>
      );
    }

    // 사진이 없으면 단색 배경
    return (
      <View
        style={[styles.cardBase, { borderRadius: radius, backgroundColor: item.backgroundColor || '#151515' }, style]}
      >
        <View style={{ paddingHorizontal: padH, paddingVertical: padV, minHeight: minH, justifyContent: 'center' }}>
          {HeaderBody}
        </View>
        <PageBadge />
      </View>
    );
  }

  // ─ 2) 질문 페이지
  if (mode === 'question') {
    return (
      <View
        style={[styles.cardBase, { borderRadius: radius, backgroundColor: item.backgroundColor || '#F4F4F4' }, style]}
      >
        <View
          style={{ paddingHorizontal: padH, paddingVertical: padV, minHeight: minH, justifyContent: 'center' }}
        >
          <Text
            style={[styles.q, { fontSize: scaleFont(40), marginBottom: scaleHeight(12) }]}
            numberOfLines={2}
          >
            {question?.question ?? ''}
          </Text>

          {!!question?.content && (
            <Text style={[styles.c, { fontSize: scaleFont(20)}]} numberOfLines={5}>
              {question.content}
            </Text>
          )}
        </View>
        <PageBadge />
      </View>
    );
  }

  // ─ 3) 이미지 전용 마지막 페이지 (텍스트/오버레이 없음)
  const finalImage = imageUrl || item.photoUrl;
  if (finalImage) {
    return (
      <ImageBackground
        source={{ uri: finalImage }}
        resizeMode="cover"
        style={[styles.cardBase, { borderRadius: radius }, style]}
        imageStyle={{ borderRadius: radius }}
      >
        <PageBadge />
      </ImageBackground>
    );
  }

  // 이미지가 전혀 없을 때 플레이스홀더
  return (
    <View style={[styles.cardBase, { borderRadius: radius, backgroundColor: '#EDEDED' }, style]}>
      <PageBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    flex: 1,
  },

  // 타이틀 페이지 텍스트
  date: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Pretendard-Medium' },
  bigTitle: { color: 'rgba(255,255,255,0.9)', fontFamily: 'Pretendard-Bold' },
  sub: { color: 'white', fontFamily: 'Pretendard-Medium' },
  subEm: { fontFamily: 'Pretendard-Bold', color: 'white', fontWeight:'500' },

  // 질문 페이지 텍스트
  q: { color: '#111', fontFamily: 'Pretendard-ExtraBold'},
  c: { color: '#333', fontFamily: 'Pretendard-Medium' },

  // 페이지 뱃지
  pageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageBadgeText: { color: '#fff', fontFamily: 'Pretendard-SemiBold' },

  // 공용 dim
  dim: { ...StyleSheet.absoluteFillObject },
});
