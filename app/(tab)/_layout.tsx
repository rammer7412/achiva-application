import ExploreIcon from '@/components/icons/ExploreIcon';
import HomeIcon from '@/components/icons/HomeIcon';
import NotificationIcon from '@/components/icons/NotificationIcon';
import PostIcon from '@/components/icons/PostIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Tabs, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// 프로필 아바타에 필요
import { useAuthStore } from '@/stores/useAuthStore';

const TAB_ICON_LIST = [HomeIcon, ExploreIcon, PostIcon, NotificationIcon, ProfileIcon];
const TAB_NAMES = ['home', 'explore', 'post', 'notification', 'profile'];

/** 프로필 탭 전용: 사용자 이미지 원형 아이콘 */
function ProfileTabAvatar({ size, focused }: { size: number; focused: boolean }) {
  const imgUrl = useAuthStore((s) => s.user?.profileImageUrl);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: '#DDD', // 이미지 없을 때 회색 원
        borderWidth: focused ? 2 : 1,
        borderColor: focused ? '#412A2A' : 'rgba(0,0,0,0.15)',
      }}
      pointerEvents="none"
    >
      {imgUrl ? (
        <Image
          source={{ uri: imgUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  const { scaleHeight, scaleWidth } = useResponsiveSize();

  const INDICATOR_MARGIN = scaleWidth(24); // 좌우 여백 보정
  const tabWidth = scaleWidth(430 / 5); // 각 탭 너비 (전체 기준 기기 너비 비례)
  const indicatorWidth = tabWidth - INDICATOR_MARGIN * 2;
  const indicatorX = useSharedValue(0);

  const segments = useSegments();
  const segment = segments[1] ?? 'home';
  const currentIndex = TAB_NAMES.indexOf(segment);

  useEffect(() => {
    if (currentIndex !== -1) {
      indicatorX.value = withTiming(currentIndex * tabWidth + INDICATOR_MARGIN, {
        duration: 200,
      });
    }
  }, [currentIndex, tabWidth, indicatorX, INDICATOR_MARGIN]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  // 아이콘과 동일 사이즈(필요시 한 번에 조절)
  const AVATAR_SIZE = scaleWidth(28);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: scaleHeight(120),
          position: 'relative',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginTop: scaleHeight(8),
        },
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            height: scaleHeight(120),
          }}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                width: indicatorWidth,
                height: scaleHeight(4),
                backgroundColor: '#412A2A',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              },
              indicatorStyle,
            ]}
          />

          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const IconComponent = TAB_ICON_LIST[index];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name as never);
              }
            };

            const isProfileTab = route.name === 'profile';

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: scaleHeight(36),
                }}
              >
                {isProfileTab ? (
                  <ProfileTabAvatar size={AVATAR_SIZE} focused={isFocused} />
                ) : (
                  <IconComponent focused={isFocused} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="home" options={{ headerShown: false, animation: 'none'}} />
      <Tabs.Screen name="explore" options={{ headerShown: false, animation: 'none' }} />
      <Tabs.Screen name="post" options={{ headerShown: false, animation: 'none' }} />
      <Tabs.Screen name="notification" options={{ headerShown: false, animation: 'none' }} />
      <Tabs.Screen name="profile" options={{ headerShown: false, animation: 'none' }} />
    </Tabs>
  );
}
