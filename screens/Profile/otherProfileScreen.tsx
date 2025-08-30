import { fetchMemberProfile } from '@/api/member';
import { ScrollContainer } from '@/components/containers/ScreenContainer';
import ArticleArea, { ArticleAreaHandle } from '@/components/screen/profile/ArticleArea';
import { CategoriesArea } from '@/components/screen/profile/CategoriesArea';
import { PointArea } from '@/components/screen/profile/PointArea';
import { ProfileBox, ProfileHeader } from '@/components/screen/profile/ProfileArea';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export default function OtherProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const memberId = Number(id);

  const articleRef = React.useRef<ArticleAreaHandle>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (!memberId) return;
    (async () => {
      try {
        await fetchMemberProfile(memberId);
      } catch (e) {
        if (__DEV__) console.log('[OtherProfileScreen] prefetch error:', e);
      }
    })();
  }, [memberId]);

  const handleScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    articleRef.current?.onParentScroll(e);
  }, []);

  const onRefresh = React.useCallback(async () => {
    if (!memberId) return;
    setRefreshing(true);
    try {
      await Promise.allSettled([
        fetchMemberProfile(memberId),
        articleRef.current?.refresh?.(memberId) ?? Promise.resolve(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [memberId]);

  return (
    <ScrollContainer
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >

      <ProfileHeader isSelf={false}/>

      <ProfileBox isSelf={false} memberId={memberId} />

      <CategoriesArea isSelf={false} memberId={memberId} />
      <PointArea isSelf={false} memberId={memberId} />
      <ArticleArea ref={articleRef} isSelf={false} memberId={memberId} />
    </ScrollContainer>
  );
}
