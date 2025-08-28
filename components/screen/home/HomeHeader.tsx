import ConfirmButton from '@/components/buttons/ConfirmButton';
import { PaddingContainer } from '@/components/containers/ScreenContainer';
import ACHIVALogo from '@/components/logo/ACHIVA-logo';
import { SimpleText } from '@/components/text/SimpleText';
import React from 'react';
import { View } from 'react-native';

export default function HomeHeader() {
  return (
    <PaddingContainer>
      <View>
        <ACHIVALogo />
        <ConfirmButton
          text="오늘의 새로운 이야기를 남겨주세요"
          onPress={() => {}}
        />
        <SimpleText>나를 응원해준 사람들의 이야기</SimpleText>
      </View>
    </PaddingContainer>
  );
}
