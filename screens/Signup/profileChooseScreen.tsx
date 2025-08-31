import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';

import { BASE_URL } from '@/utils/apiClients';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import mime from 'mime';
import React, { useState } from 'react';
import { Alert, Image, View } from 'react-native';

export default function ProfileChooseScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const { setProfileImageUrl } = useUserSignupStore();

  const D = (...args: any[]) => { if (__DEV__) console.log('[ProfileChoose]', ...args); };
  const getCT = (uri: string) => mime.getType(uri) || 'image/jpeg';

  // ✅ presigned URL 요청
  const getPresignedUrl = async (contentType: string) => {
    const response = await axios.get(`${BASE_URL}/api/members/presigned-url`, {
      params: { contentType },
    });
    const d = response.data?.data ?? response.data ?? {};
    const uploadUrl: string | undefined = d.uploadUrl ?? d.url;
    const accessUrl: string | undefined = d.accessUrl ?? (d.url ? d.url.split('?')[0] : undefined);
    if (!uploadUrl || !accessUrl) throw new Error('presigned URL 응답 누락');
    D('presign', { uploadUrl, accessUrl });
    return { uploadUrl, accessUrl };
  };

  // ✅ S3에 실제 업로드
  const uploadToS3 = async (uploadUrl: string, uri: string, contentType: string) => {
    const blob = await (await fetch(uri)).blob();
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: blob,
    });
    if (!res.ok) throw new Error(`S3 업로드 실패: ${res.status}`);
    D('S3 upload ok');
  };

  // ✅ 갤러리/카메라로 이미지 선택 후 업로드
  const handleImageUpload = async (uri: string) => {
    const contentType = getCT(uri);
    const { uploadUrl, accessUrl } = await getPresignedUrl(contentType);
    await uploadToS3(uploadUrl, uri, contentType);
    setImageUri(uri);                 // 미리보기용 로컬 URI
    setProfileImageUrl(accessUrl);    // 최종 회원가입에 보낼 S3 accessUrl
    setHasCustomImage(true);
    D('user image uploaded ->', accessUrl);
  };

  // ✅ 사진 선택 UI
  const handlePickPhoto = () => {
    if (loading) return;
    Alert.alert(
      '사진 선택',
      '사진을 추가할 방법을 선택하세요.',
      [
        { text: '카메라로 촬영', onPress: pickFromCamera },
        { text: '갤러리에서 선택', onPress: pickFromGallery },
        { text: '취소', style: 'cancel' },
      ],
      { cancelable: true }
    );
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
        setLoading(true);
        await handleImageUpload(result.assets[0].uri);
      } catch (e: any) {
        console.error('❌ 카메라 업로드 실패:', e?.message || e);
        Alert.alert('업로드 실패', '이미지 업로드 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        setLoading(true);
        await handleImageUpload(result.assets[0].uri);
      } catch (e: any) {
        console.error('❌ 갤러리 업로드 실패:', e?.message || e);
        Alert.alert('업로드 실패', '이미지 업로드 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  // 다음 단계로 (카테고리 선택)
  const handleNext = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 커스텀 이미지를 안 골랐다면 기본 이미지 업로드 없이 빈(placeholder) 상태로 진행
      const currentUrl = useUserSignupStore.getState().profileImageUrl;
      if (!hasCustomImage && currentUrl) {
        // 혹시 이전 단계에서 저장된 URL이 있다면 유지
      }

      router.push('/signup/categorychoose');
    } catch (e: any) {
      console.error('❌ 다음 단계 이동 실패:', e?.message || e);
      Alert.alert('오류', '다음 단계로 이동 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // -------- UI --------
  const AVATAR_SIZE = scaleWidth(120);
  const AVATAR_RADIUS = AVATAR_SIZE / 2;
  const BORDER_COLOR = '#4E3F3F';     // 갈색 계열
  const BG_COLOR = '#FFFFFF';

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingHorizontal: scaleWidth(24), backgroundColor: '#fff' }}>
        <HeaderWithBack total={6} current={4} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <NoticeMessageTitle
            message="프로필 사진 추가"
            subtitle="친구들이 회원님을 알아볼 수 있도록 프로필 사진을 추가하세요. 프로필 사진은 모든 사람에게 공개됩니다."
          />

          <View style={{ marginTop: scaleHeight(32), marginBottom: scaleHeight(20) }}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_RADIUS,
                  resizeMode: 'cover',
                  backgroundColor: '#eee',
                }}
                accessible
                accessibilityLabel="선택된 프로필 사진"
              />
            ) : (
              // ▶ 기본: 갈색 테두리의 흰 배경 원형
              <View
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_RADIUS,
                  backgroundColor: BG_COLOR,
                  borderWidth: Math.max(1, AVATAR_SIZE * 0.012), // 사이즈에 비례하여 선 두께
                  borderColor: BORDER_COLOR,
                }}
                accessible
                accessibilityLabel="기본 프로필 자리 표시자"
              />
            )}
          </View>

          <View style={{ marginTop: scaleHeight(50), width: '100%' }}>
            <ConfirmButton text={loading ? '처리 중...' : '사진 추가'} onPress={handlePickPhoto} disabled={loading} />
            <View style={{ height: scaleHeight(12) }} />
            <ConfirmButton
              text={loading ? '처리 중...' : (hasCustomImage ? '확인' : '건너뛰기')}
              onPress={handleNext}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
