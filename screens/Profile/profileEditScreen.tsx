import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';

import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import TitleWithBack from '@/components/header/TitleWithBack';
import DefaultInput from '@/components/inputbox/DefaultInput';
import CategorySpace from '@/components/space/CategorySpace';

import type { UpdateProfilePayload } from '@/types/ApiTypes';
import type { User } from '@/types/User';
import { useResponsiveSize } from '@/utils/ResponsiveSize';

// ⬇️ 네가 둔 모듈 경로에 맞춰 조정 (users or members)
import { getProfilePresignedUrl, uploadToS3 } from '@/api/uploads';
import { getMe, updateMyProfile } from '@/api/users';

const ALL_CATEGORIES = ['공부','운동','독서','취미','커리어','자기계발','투자','루틴','마인드셋'];
const MAX_CATEGORIES = 5;
const MIN_CATEGORIES = 1;

export default function ProfileEditScreen() {
  const { scaleWidth, scaleHeight, scaleFont, safeArea } = useResponsiveSize();
  const setSignupProfileUrl = useUserSignupStore((s) => s.setProfileImageUrl);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);  // ⬅️ 초기 로딩 표시용
  const [me, setMe] = useState<User | null>(null);

  const [nickName, setNickName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editingNick, setEditingNick] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingCategories, setEditingCategories] = useState(false);

  // ✅ 초기 로드: getMe() 응답이 ApiBaseResponse<User> 또는 User 둘 다 대응
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMe();
        // 응답이 { data: User } 형태면 data 사용, 아니면 그대로 사용
        const data: User = (res as any)?.data ?? (res as any);
        if (!mounted) return;
        setMe(data);
        setNickName(data?.nickName ?? '');
        setDescription((data as any)?.description ?? (data as any)?.intro ?? '');
        setCategories((data as any)?.categories ?? []);
        setImageUri(data?.profileImageUrl ?? null);
      } catch (e) {
        if (__DEV__) console.warn('[ProfileEdit] getMe error:', e);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const avatarSize = useMemo(() => scaleWidth(120), [scaleWidth]);
  const plusSize   = useMemo(() => scaleWidth(26),  [scaleWidth]);

  const suggestions = useMemo(
    () => ALL_CATEGORIES.filter((c) => !categories.includes(c)),
    [categories]
  );

  const handleToggleCategory = (label: string, nextSelected: boolean) => {
    setCategories((prev) => {
      if (nextSelected) {
        if (prev.includes(label) || prev.length >= MAX_CATEGORIES) return prev;
        return [...prev, label];
      }
      return prev.filter((x) => x !== label);
    });
  };

  const saveDisabled = loading || uploading || categories.length < MIN_CATEGORIES;

  const D = (...args: any[]) => { if (__DEV__) console.log('[ProfileEdit]', ...args); };
  const getCT = (uri: string) => mime.getType(uri) || 'image/jpeg';

  const handleImageUpload = async (localUri: string) => {
    const contentType = getCT(localUri);
    const { uploadUrl, accessUrl } = await getProfilePresignedUrl(contentType);
    setImageUri(localUri);                          // 미리보기
    await uploadToS3(uploadUrl, localUri, contentType);
    setImageUri(accessUrl);                         // 실제 접근 URL로 교체
    D('uploaded ->', accessUrl);
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        setUploading(true);
        await handleImageUpload(result.assets[0].uri);
      } catch (e: any) {
        console.error('❌ 카메라 업로드 실패:', e?.message || e);
        Alert.alert('업로드 실패', '이미지 업로드 중 문제가 발생했습니다.');
      } finally {
        setUploading(false);
      }
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      // expo 버전에 따라 아래 줄을 MediaTypeOptions.Images로 바꿔도 됨
      mediaTypes: ['images'] as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        setUploading(true);
        await handleImageUpload(result.assets[0].uri);
      } catch (e: any) {
        console.error('❌ 갤러리 업로드 실패:', e?.message || e);
        Alert.alert('업로드 실패', '이미지 업로드 중 문제가 발생했습니다.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handlePickPhoto = () => {
    if (uploading || loading) return;
    Alert.alert(
      '사진 선택',
      '프로필 사진을 선택하세요.',
      [
        { text: '카메라 촬영', onPress: pickFromCamera },
        { text: '갤러리에서 선택', onPress: pickFromGallery },
        { text: '취소', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // ✅ 저장: payload 생성 + updateMyProfile 호출
  const handleSave = async () => {
    if (categories.length < MIN_CATEGORIES) {
      Alert.alert('알림', '카테고리는 최소 1개 이상 선택해야 해요.');
      return;
    }
    if (!me) {
      Alert.alert('알림', '프로필 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const payload: UpdateProfilePayload = {
      email:           me.email ?? '',
      nickName:        (nickName ?? '').trim(),
      profileImageUrl: imageUri ?? me.profileImageUrl ?? '',
      birth:           (me as any).birth ?? '',
      gender:          (me as any).gender ?? '',
      region:          (me as any).region ?? '',
      categories:      categories,
      description:     (description ?? '').trim(),
    };

    try {
      setLoading(true);
      await updateMyProfile(payload);
      setUserSignupProfileUrlSafe(payload.profileImageUrl);
      router.back();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? '저장 중 오류가 발생했습니다.';
      Alert.alert('저장 실패', msg);
    } finally {
      setLoading(false);
    }
  };

  const setUserSignupProfileUrlSafe = (url?: string) => {
    try { setSignupProfileUrl(url || ''); } catch {}
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <TitleWithBack title="프로필 수정" />

        {/* ⬇️ 초기 로딩일 때 간단한 로더 (선택) */}
        {initialLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {/* 아바타 */}
            <View style={{ alignItems: 'center', marginTop: scaleHeight(24) }}>
              <View
                style={{
                  width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,
                  backgroundColor: '#E6E0DE', overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
                }}
              >
                {uploading && (
                  <View
                    style={{
                      position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 2,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                )}

                {imageUri ? (
                  <>
                    {imgLoading && <ActivityIndicator />}
                    <Image
                      source={{ uri: imageUri }}
                      style={{ width: avatarSize, height: avatarSize }}
                      onLoadStart={() => setImgLoading(true)}
                      onLoadEnd={() => setImgLoading(false)}
                      resizeMode="cover"
                    />
                  </>
                ) : (
                  <Ionicons name="image-outline" size={scaleFont(36)} color="#F2F2F2" />
                )}
              </View>

              <TouchableOpacity
                onPress={handlePickPhoto}
                activeOpacity={0.85}
                style={{
                  position: 'absolute',
                  right: (scaleWidth(430) - avatarSize) / 2 - plusSize * 0.15,
                  bottom: -plusSize * 0.15,
                  width: plusSize, height: plusSize, borderRadius: plusSize / 2,
                  backgroundColor: '#442727', justifyContent: 'center', alignItems: 'center',
                  borderWidth: 2, borderColor: '#fff',
                }}
              >
                <Ionicons name="add" size={scaleFont(16)} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* 닉네임 */}
            <View style={{ marginTop: scaleHeight(28), paddingHorizontal: scaleWidth(24) }}>
              <Text style={{ fontSize: scaleFont(14), fontWeight: '600', color: '#2B2B2B' }}>닉네임</Text>
              <View style={{ marginTop: scaleHeight(10) }}>
                <DefaultInput
                  value={nickName}
                  placeholder="닉네임을 입력하세요"
                  editable={editingNick}
                  onChangeText={setNickName}
                  onPress={() => setEditingNick(true)}
                  onPressEdit={() => setEditingNick(true)}
                  showRightIcon={!editingNick}
                  inputProps={{
                    returnKeyType: 'done',
                    onSubmitEditing: () => setEditingNick(false),
                    onBlur: () => setEditingNick(false),
                    autoCapitalize: 'none',
                  }}
                />
              </View>
            </View>

            {/* 관심 카테고리 */}
            <View style={{ marginTop: scaleHeight(24), paddingHorizontal: scaleWidth(24) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: scaleFont(14), fontWeight: '600', color: '#2B2B2B' }}>
                  관심있는 성취 카테고리
                </Text>
                <Text style={{ fontSize: scaleFont(12), color: categories.length < MIN_CATEGORIES ? '#D54A4A' : '#8D7B77' }}>
                  {categories.length}/{MAX_CATEGORIES}
                </Text>
              </View>

              <View style={{ marginTop: scaleHeight(10) }}>
                <CategorySpace
                  selected={categories}
                  suggestions={suggestions}
                  editable={editingCategories}
                  onPressEdit={() => setEditingCategories(prev => !prev)}
                  onToggle={handleToggleCategory}
                  placeholder="관심 카테고리를 선택해 주세요."
                  size="sm"
                  maxSelected={MAX_CATEGORIES}
                  minSelected={0}
                  onMaxReached={() =>
                    Alert.alert('알림', '카테고리는 최대 5개까지 선택할 수 있어요.')
                  }
                />
                {categories.length < MIN_CATEGORIES && (
                  <Text
                    style={{ marginTop: scaleHeight(6), color: '#D54A4A', fontSize: scaleFont(12) }}
                  >
                    카테고리는 최소 1개 이상 선택해야 저장할 수 있어요.
                  </Text>
                )}
              </View>
            </View>

            {/* 소개 한 줄 */}
            <View style={{ marginTop: scaleHeight(24), paddingHorizontal: scaleWidth(24) }}>
              <Text style={{ fontSize: scaleFont(14), fontWeight: '600', color: '#2B2B2B' }}>
                나를 소개하는 한 줄
              </Text>

              <View style={{ marginTop: scaleHeight(10) }}>
                <DefaultInput
                  value={description}
                  placeholder="나를 소개하는 한 줄을 적어보세요."
                  editable={editingDesc}
                  onChangeText={setDescription}
                  onPress={() => setEditingDesc(true)}
                  onPressEdit={() => setEditingDesc(true)}
                  showRightIcon={!editingDesc}
                  style={{ minHeight: Math.max(scaleHeight(96), 72), paddingTop: scaleHeight(12) }}
                  inputProps={{
                    multiline: true,
                    numberOfLines: 3,
                    textAlignVertical: 'top',
                    returnKeyType: 'done',
                    onSubmitEditing: () => setEditingDesc(false),
                    onBlur: () => setEditingDesc(false),
                  }}
                />
              </View>
            </View>
          </>
        )}
      </View>

      {/* 고정 하단 바 */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: safeArea.bottom + scaleHeight(12),
            paddingHorizontal: scaleWidth(24),
          },
        ]}
      >
        <ConfirmButton
          text={loading ? '저장 중...' : '저장'}
          onPress={handleSave}
          disabled={saveDisabled || initialLoading}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
});
