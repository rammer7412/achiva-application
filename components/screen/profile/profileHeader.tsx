// components/ProfileBox.tsx
import GearSixIcon from '@/components/icons/GearSixIcon';
import React from 'react';
import { View } from 'react-native';

export default function ProfileHeader() {
  return (
    <View>
        <GearSixIcon focused={false} />
    </View>
  );
}

