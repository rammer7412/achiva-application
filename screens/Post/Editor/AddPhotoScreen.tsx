// @/screens/Post/Editor/AddPhotoScreen.tsx
import ScreenContainer from '@/components/ScreenContainer';
import TitleWithBack from '@/components/TitleWithBack';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import { usePostDraftStore } from '@/stores/usePostDraftStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';

import { BASE_URL } from '@/utils/authApi';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import mime from 'mime';
import React, { useState } from 'react';
import { Alert, Image, View } from 'react-native';

export default function AddPhotoScreen() {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const setPhotoUri   = usePostDraftStore((s) => s.setPhotoUri);
  const currentPhoto  = usePostDraftStore((s) => s.photoUri);

  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const D = (...args: any[]) => { if (__DEV__) console.log('[AddPhoto]', ...args); };
  const getCT = (uri: string) => mime.getType(uri) || 'image/jpeg';

  /** presigned URL 발급 */
  const getPresignedUrl = async (contentType: string) => {
    const res = await axios.get(`${BASE_URL}/api/members/presigned-url`, {
      params: { contentType },
    });
    const d = res.data?.data ?? res.data ?? {};
    const uploadUrl: string | undefined = d.uploadUrl ?? d.url;
    const accessUrl: string | undefined = d.accessUrl ?? (d.url ? d.url.split('?')[0] : undefined);
    if (!uploadUrl || !accessUrl) throw new Error('presigned URL 응답 누락');
    D('presign', { uploadUrl, accessUrl });
    return { uploadUrl, accessUrl };
  };

  /** S3 업로드 */
  const uploadToS3 = async (uploadUrl: string, uri: string, contentType: string) => {
    const blob = await (await fetch(uri)).blob();
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: blob,
    });
    if (!putRes.ok) throw new Error(`S3 업로드 실패: ${putRes.status}`);
  };

  /** 갤러리에서 선택 */
  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        setUploading(true);
        const uri = result.assets[0].uri;
        const ct = getCT(uri);
        const { uploadUrl, accessUrl } = await getPresignedUrl(ct);
        await uploadToS3(uploadUrl, uri, ct);
        setLocalPreview(uri);      // 화면 미리보기용 로컬 URI
        setPhotoUri(accessUrl);    // 서버 업로드 때 사용할 S3 접근 URL
        D('uploaded ->', accessUrl);
      } catch (e: any) {
        console.error(e);
        Alert.alert('업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
      } finally {
        setUploading(false);
      }
    }
  };

  /** 다음 → 표지 미리보기 (사진이 없어도 진행 가능) */
  const goPreview = () => {
    router.push('/post/previewcover');
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: scaleWidth(24) }}>
        <TitleWithBack
          title="사진 추가"
          showSeparator={false}
        />

        <View style={{ marginTop: scaleHeight(12), alignItems: 'center' }}>
          <Image
            source={
              localPreview
                ? { uri: localPreview }
                : currentPhoto
                ? { uri: currentPhoto }
                : require('@/assets/images/react-logo.png') // 플레이스홀더
            }
            style={{
              width: '100%',
              height: scaleHeight(500),
              borderRadius: 6,
              resizeMode: 'cover',
              backgroundColor: '#eee',
            }}
          />
        </View>

        <View style={{ marginTop: 'auto', marginBottom: scaleHeight(24) }}>
          <ConfirmButton
            text={uploading ? '업로드 중...' : '갤러리에서 선택'}
            onPress={pickFromGallery}
            disabled={uploading}
          />
          <ConfirmButton
            text={'다음'}
            onPress={goPreview}
            disabled={uploading}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
