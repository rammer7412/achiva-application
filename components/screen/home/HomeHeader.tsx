import ConfirmButton from '@/components/buttons/ConfirmButton';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import ACHIVALogo from '@/components/logo/ACHIVA-logo';
import { SimpleText } from '@/components/text/SimpleText';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { View } from 'react-native';

export default function HomeHeader() {
  const {scaleHeight} = useResponsiveSize();
  return (
    <PaddingContainer>
      <View>
        <View style={{marginTop: scaleHeight(8)}}>
          <ACHIVALogo />
        </View>
        <ConfirmButton
          text="오늘의 새로운 이야기를 남겨주세요"
          onPress={() => {}}
        />
        <SimpleText>나를 응원해준 사람들의 이야기</SimpleText>
      </View>
    </PaddingContainer>
  );
}
