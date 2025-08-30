import { fetchMemberProfile } from '@/api/member';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import { BackHeader } from '@/components/header/BackHeader';
import EmptyProfileIcon from '@/components/icons/EmptyProfileIcon';
import GearSixIcon from '@/components/icons/GearSixIcon';
import { SimpleText } from '@/components/text/SimpleText';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Member } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';

import { Image, StyleSheet, View } from 'react-native';

type ProfileBoxProps = {
  isSelf?: boolean;
  memberId?: number;
  button?: React.ReactNode;
};

type Props = {
  isSelf?: boolean;
};

export function ProfileHeader({isSelf=true} : Props) {
  const { scaleWidth } = useResponsiveSize();
  return (
    <PaddingContainer>  
        {isSelf ? <View style={{marginTop: scaleWidth(10), width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}><GearSixIcon focused={false} /></View> : <BackHeader />}
    </PaddingContainer>
  );
}

export function ProfileBox({ isSelf = true, memberId, button }: ProfileBoxProps) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const me = useAuthStore((s) => s.user);

  const [other, setOther] = React.useState<Member | null>(null);

  // 타인 프로필 조회
  React.useEffect(() => {
    if (isSelf || !memberId) return;
    let mounted = true;
    (async () => {
      try {
        const data = await fetchMemberProfile(memberId);

        if (mounted) setOther(data);
      } catch (e) {
        if (__DEV__) console.log('[ProfileBox] fetchMemberProfile error:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isSelf, memberId]);

  const userName = isSelf ? me?.nickName ?? '' : other?.nickName ?? '';
  const desc = isSelf
    ? me?.description ?? '나를 소개하는 한 줄을 적었을 때'
    : (other as any)?.description ?? '';
  const imgUrl = isSelf ? me?.profileImageUrl ?? null : other?.profileImageUrl ?? null;

  const AVATAR_SIZE = 96;
  const profileSize = scaleWidth(AVATAR_SIZE);

  return (
    <PaddingContainer>
      <View style={[styles.row, { paddingBottom: scaleHeight(12) }]}>
        {imgUrl ? (
          <Image
            source={{ uri: imgUrl }}
            style={{
              width: profileSize,
              height: profileSize,
              borderRadius: profileSize / 2,
              backgroundColor: '#D9D9D9',
            }}
            resizeMode="cover"
          />
        ) : (
          <EmptyProfileIcon size={AVATAR_SIZE} />
        )}

        <View style={{ marginLeft: scaleWidth(20), flex: 1 }}>
          <SimpleText
            size={24}
            color="#111"
            fontFamily="Pretendard-ExtraBold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userName}
          </SimpleText>

          {!!desc && (
            <SimpleText
              size={16}
              color="#8E8E8E"
              fontFamily="Pretendard-Bold"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ marginTop: scaleHeight(4) }}
            >
              {desc}
            </SimpleText>
          )}

          {isSelf && button ? (
            <View style={{ marginTop: scaleHeight(10), alignSelf: 'flex-start' }}>
              {button}
            </View>
          ) : null}
        </View>
      </View>
    </PaddingContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});