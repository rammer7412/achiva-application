import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
  message: string;
  subtitle?: ReactNode;
};

export default function NoticeMessageTitle({ message, subtitle }: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();

  return (
    <View
      style={{
        marginTop: scaleHeight(36),
        marginBottom: scaleHeight(24),
        paddingHorizontal: scaleWidth(8),
      }}
    >
      <Text
        style={{
          fontSize: scaleFont(24),
          fontWeight: 'bold',
          color: '#111',
          textAlign: 'left',
          fontFamily: 'Pretendard-ExtraBold',
        }}
      >
        {message}
      </Text>
      {subtitle && (
        <Text
          style={{
            marginTop: scaleHeight(14),
            fontSize: scaleFont(15),
            lineHeight: scaleHeight(24),
            marginBottom: scaleHeight(14),
            color: '#555',
            textAlign: 'left',
            fontFamily: 'Pretendard-Variable',
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
