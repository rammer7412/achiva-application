// components/screen/home/ArticleCard.tsx
import type { Article, Question } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  item: Article;
  index: number;       // ← 있어도 되지만, 이제 카드 내부에선 사용 안 함
  total: number;       // ← 있어도 되지만, 이제 카드 내부에선 사용 안 함
  mode: 'title' | 'question' | 'image';
  question?: Question;
  imageUrl?: string;
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
  // index, total,  // ← 내부에서 더 이상 사용하지 않음
  mode,
  question,
  imageUrl,
  style,
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont, smartScale } = useResponsiveSize();

  const radius = smartScale(0, 0);
  const padH = scaleWidth(20);
  const padV = scaleHeight(22);
  const minH = scaleHeight(220);

  if (mode === 'title') {
    const HeaderBody = (
      <View style={{ flex: 1, justifyContent: 'center' }}>
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

        <Text style={[styles.sub, { fontSize: scaleFont(48) }]} numberOfLines={2}>
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
          style={[
            styles.cardBase,
            { borderRadius: radius, backgroundColor: item.backgroundColor || '#000' },
            style,
          ]}
          imageStyle={{ borderRadius: radius }}
        >
          <View
            style={[
              styles.dim,
              { backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center' },
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
          </View>
        </ImageBackground>
      );
    }

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
      </View>
    );
  }

  if (mode === 'question') {
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
            style={[styles.q, { fontSize: scaleFont(40), marginBottom: scaleHeight(12) }]}
            numberOfLines={2}
          >
            {question?.question ?? ''}
          </Text>

          {!!question?.content && (
            <Text style={[styles.c, { fontSize: scaleFont(20) }]} numberOfLines={5}>
              {question.content}
            </Text>
          )}
        </View>
      </View>
    );
  }

  const finalImage = imageUrl || item.photoUrl;
  if (finalImage) {
    return (
      <ImageBackground
        source={{ uri: finalImage }}
        resizeMode="cover"
        style={[styles.cardBase, { borderRadius: radius }, style]}
        imageStyle={{ borderRadius: radius }}
      />
    );
  }

  return (
    <View
      style={[styles.cardBase, { borderRadius: radius, backgroundColor: '#EDEDED' }, style]}
    />
  );
}

const styles = StyleSheet.create({
  cardBase: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    flex: 1,
  },

  date: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Pretendard-Medium' },
  bigTitle: { color: 'rgba(255,255,255,0.9)', fontFamily: 'Pretendard-Bold' },
  sub: { color: 'white', fontFamily: 'Pretendard-Medium' },
  subEm: { fontFamily: 'Pretendard-Bold', color: 'white', fontWeight: '500' },

  q: { color: '#111', fontFamily: 'Pretendard-ExtraBold' },
  c: { color: '#333', fontFamily: 'Pretendard-Medium' },

  dim: { ...StyleSheet.absoluteFillObject },
});
