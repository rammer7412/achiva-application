import { SmallButton } from '@/components/buttons/DefaultButton';
import { ScrollContainer } from '@/components/containers/ScreenContainer';
import { ArticleArea } from '@/components/screen/profile/ArticleArea';
import { CategoriesArea } from '@/components/screen/profile/CategoriesArea';
import { PointArea } from '@/components/screen/profile/PointArea';
import { ProfileBox, ProfileHeader } from '@/components/screen/profile/ProfileArea';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  const { scaleHeight } = useResponsiveSize();

  return (
    <ScrollContainer>
      <View>
        <ProfileHeader/>
      </View>

      <ProfileBox button={
        <SmallButton
          size={18}
          fontFamily="Pretendard-ExtraBold"
          onPress={() => {/* 이동/액션 */}}
        />
        }
      />

      <CategoriesArea/>

      <PointArea/>

      <ArticleArea/>

    </ScrollContainer>
  );
}

