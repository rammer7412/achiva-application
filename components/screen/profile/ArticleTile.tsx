import { Article } from '@/types/ApiTypes';
import React, { memo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

type Props = {
  item: Article;
  gap: number;
  onPress?: () => void;
};

function ArticleTile({ item, gap, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ width: '33.3333%', padding: gap / 2 }}
    >
      <View style={{ aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: '#333' }}>
        {item.photoUrl ? (
          <Image
            source={{ uri: item.photoUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default memo(ArticleTile);
