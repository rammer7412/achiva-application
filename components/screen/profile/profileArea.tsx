// components/ProfileBox.tsx
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import EmptyProfileIcon from '@/components/icons/EmptyProfileIcon';
import GearSixIcon from '@/components/icons/GearSixIcon';
import { SimpleText } from '@/components/text/SimpleText';
import { useAuthStore } from '@/stores/useAuthStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';

import { Image, StyleSheet, View } from 'react-native';

type ProfileBoxProps = {
  button?: React.ReactNode;
};

export function ProfileHeader() {
  const { scaleWidth} = useResponsiveSize();
  return (
    <PaddingContainer>
      <View style={{ backgroundColor: 'red',marginTop: scaleWidth(10), width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <GearSixIcon focused={false} />
      </View>
    </PaddingContainer>
  );
}

export function ProfileBox({ button }: ProfileBoxProps) {
  const user = useAuthStore((s) => s.user);
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const userName = user?.nickName ?? '';
  const desc = user?.description ?? '나를 소개하는 한 줄을 적었을 때';
  const imgUrl = user?.profileImageUrl ?? null;

  const AVATAR_SIZE = 96;
  const profileSize = scaleWidth(AVATAR_SIZE);

  return (
    <PaddingContainer>
      <View
        style={[
          styles.row,
          {
            paddingBottom: scaleHeight(30),
          },
        ]}
      >
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
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ marginTop: scaleHeight(4) }}
            >
              {desc}
            </SimpleText>
          )}
          
          {button ? (
            <View style={{ marginTop: scaleHeight(16), alignSelf: 'flex-start' }}>
              {button}
            </View>
          ) : null}
          
        </View>
      </View>
    </PaddingContainer>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',},
});
