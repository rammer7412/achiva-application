import { SmallButton } from '@/components/buttons/DefaultButton';
import { ScrollContainer } from '@/components/containers/ScreenContainer';
import ArticleArea, { ArticleAreaHandle } from '@/components/screen/profile/ArticleArea';
import { CategoriesArea } from '@/components/screen/profile/CategoriesArea';
import { PointArea } from '@/components/screen/profile/PointArea';
import { ProfileBox, ProfileHeader } from '@/components/screen/profile/ProfileArea';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';

export default function ProfileScreen() {
  const { scaleHeight } = useResponsiveSize();

  const articleRef = React.useRef<ArticleAreaHandle>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    articleRef.current?.onParentScroll(e);
  }, []);

  const onRefresh = React.useCallback(async () => {
    if (!articleRef.current) return;
    setRefreshing(true);
    try {
      await articleRef.current.refresh();   // ✅ 새로고침 실행 & 대기
    } finally {
      setRefreshing(false);                 // ✅ 스피너 종료
    }
  }, []);

  return (
    <ScrollContainer
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshing={refreshing}               // ✅ 당겨서 새로고침 표시
      onRefresh={onRefresh}                 // ✅ 당겨서 새로고침 동작
    >
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

      <ArticleArea ref={articleRef} />

    </ScrollContainer>
  );
}

