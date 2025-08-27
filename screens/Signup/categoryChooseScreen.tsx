import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CategoryChooseScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const {setCategories} = useUserSignupStore();

  const categories = ['공부', '운동', '커리어', '독서', '자기계발', '취미', '투자', '루틴', '마인드셋'];
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (item: string) => {
    setSelected((prev) => {
      let newList: string[];
      if (prev.includes(item)) {
        newList = prev.filter((v) => v !== item);
      } else if (prev.length < 5) {
        newList = [...prev, item];
      } else {
        newList = prev;
      }
      setCategories(newList);
      return newList;
    });
  };

  const handleNext = () => {
    if (selected.length > 0) {
      router.push('/signup/pledge');
    }
  };

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleWidth(24),
          backgroundColor: '#fff',
        }}
      >
        <HeaderWithBack total={6} current={5} />

        <NoticeMessageTitle
          message="원하는 성취 카테고리를 선택해주세요"
          subtitle="1개 이상, 최대 5개까지 선택할 수 있어요"
        />

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: scaleWidth(8),
            marginTop: scaleHeight(20),
          }}
        >
          {categories.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleCategory(item)}
                style={{
                  paddingVertical: scaleHeight(10),
                  paddingHorizontal: scaleWidth(16),
                  backgroundColor: isSelected ? '#442727' : '#fff',
                  borderColor: '#888888',
                  borderWidth: 1,
                  borderRadius: scaleWidth(6),
                  marginBottom: scaleHeight(12),
                }}
              >
                <Text
                  style={{
                    color: isSelected ? '#fff' : '#442727',
                    fontSize: scaleWidth(16),
                    fontWeight: '500',
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            marginTop: scaleHeight(420),
            marginBottom: scaleHeight(24),
          }}
        >
          <ConfirmButton
            text="다음"
            onPress={handleNext}
            disabled={selected.length === 0}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
