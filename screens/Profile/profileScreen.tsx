import { SmallButton } from '@/components/buttons/DefaultButton';
import { ScrollContainer } from '@/components/containers/ScreenContainer';
import ArticleArea, { ArticleAreaHandle } from '@/components/screen/profile/ArticleArea';
import { CategoriesArea } from '@/components/screen/profile/CategoriesArea';
import { PointArea } from '@/components/screen/profile/PointArea';
import { ProfileBox, ProfileHeader } from '@/components/screen/profile/ProfileArea';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';

export default function ProfileScreen() {

  const router = useRouter();
  const articleRef = React.useRef<ArticleAreaHandle>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const handleScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    articleRef.current?.onParentScroll(e);
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        refreshUser(),                                 // 프로필(닉네임/사진/소개) 갱신
        articleRef.current?.refresh?.() ?? Promise.resolve(), // 게시글 새로고침
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshUser]);

  return (
    <ScrollContainer
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <View>
        <ProfileHeader/>
      </View>

      <ProfileBox button={
        <SmallButton
          size={18}
          fontFamily="Pretendard-ExtraBold"
          onPress={() => router.push('/profile/profileedit')}
        />
        }
      />

      <CategoriesArea/>

      <PointArea/>

      <ArticleArea ref={articleRef} />

    </ScrollContainer>
  );
}

