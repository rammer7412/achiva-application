import { SmallButton } from '@/components/buttons/DefaultButton';
import { ScrollContainer } from '@/components/containers/ScreenContainer';
import ArticleArea, { ArticleAreaHandle } from '@/components/screen/profile/ArticleArea';
import { CategoriesArea } from '@/components/screen/profile/CategoriesArea';
import { PointArea } from '@/components/screen/profile/PointArea';
import { ProfileBox, ProfileHeader } from '@/components/screen/profile/ProfileArea';
import { refreshUser } from '@/utils/refresh';
import { useRouter } from 'expo-router';
import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const articleRef = React.useRef<ArticleAreaHandle>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    articleRef.current?.onParentScroll(e);
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        refreshUser(),
        articleRef.current?.refresh?.() ?? Promise.resolve(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollContainer
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <ProfileHeader />

      <ProfileBox
        button={
          <SmallButton
            size={18}
            fontFamily="Pretendard-ExtraBold"
            onPress={() => router.push('/profile/profileedit')}
          />
        }
      />

      <CategoriesArea />
      <PointArea />
      <ArticleArea ref={articleRef} />
    </ScrollContainer>
  );
}
