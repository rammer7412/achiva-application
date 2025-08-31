// screens/AccountAgreeScreen.tsx
import ConfirmButton from '@/components/buttons/ConfirmButton';
import AgreementItem from '@/components/checkbox/AgreementItem';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import HeaderWithBack from '@/components/header/HeaderWithBack';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BRAND = '#442727';
const ALL_OFF_BG = '#EEEDEC';
const ALL_ON_TEXT = '#FFFFFF';
const ALL_OFF_TEXT = '#666666';
const ALL_OFF_ICON = '#BDB6B3';

export default function AccountAgreeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scaleFont, scaleHeight, scaleWidth } = useResponsiveSize();

  // 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeCommunity, setAgreeCommunity] = useState(false);
  const [agreeConsign, setAgreeConsign] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // 사이즈 토큰
  const S = useMemo(
    () => ({
      side: scaleWidth(24),
      gapTop: scaleHeight(8),
      allPadV: scaleHeight(16),
      allPadH: scaleWidth(16),
      allRadius: 5,
      secTitleTop: scaleHeight(36),
      secTitleBottom: scaleHeight(8),
      bottomOffset: insets.bottom + scaleHeight(48),
      scrollBottomSpacer: insets.bottom + scaleHeight(96),
      sectionTitleSize: scaleFont(16),
      allIcon: Math.min(scaleWidth(25), scaleHeight(25)),
    }),
    [scaleFont, scaleHeight, scaleWidth, insets.bottom]
  );

  // 전체 토글 (박스 전체를 누르면 동작)
  const toggleAll = () => {
    const v = !agreeAll;
    setAgreeAll(v);
    setAgreeService(v);
    setAgreePrivacy(v);
    setAgreeCommunity(v);
    setAgreeConsign(v);
    setAgreeMarketing(v);
  };

  // 다음 이동
  const handleNext = () => {
    if (agreeService && agreePrivacy && agreeCommunity && agreeConsign) {
      router.push('/signup/birthinput');
    } else {
      Alert.alert('필수 약관에 동의해주세요.');
    }
  };

  // 전체 상태 동기화(선택 포함 전부 true여야 agreeAll=true)
  useEffect(() => {
    setAgreeAll(
      agreeService && agreePrivacy && agreeCommunity && agreeConsign && agreeMarketing
    );
  }, [agreeService, agreePrivacy, agreeCommunity, agreeConsign, agreeMarketing]);

  const requiredAllChecked =
    agreeService && agreePrivacy && agreeCommunity && agreeConsign;

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: S.side,
            paddingTop: scaleHeight(8),
            paddingBottom: S.scrollBottomSpacer,
            backgroundColor: '#FFFFFF',
          }}
          bounces
        >
          <HeaderWithBack total={6} current={3} />

          <View style={{ marginTop: scaleHeight(8) }}>
            <NoticeMessageTitle
              message="아래 약관에 동의해주세요"
              subtitle="가입을 위해 약관에 동의가 필요합니다"
            />
          </View>

          {/* 전체 약관 동의 박스: 왼쪽 체크 '아이콘' + 가운데 정렬 텍스트 */}
          <View style={{ marginTop: S.gapTop }}>
            <Pressable
              onPress={toggleAll}
              style={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: S.allPadV,
                paddingHorizontal: S.allPadH,
                borderRadius: S.allRadius,
                backgroundColor: agreeAll ? BRAND : ALL_OFF_BG,
              }}
              accessibilityRole="button"
              accessibilityLabel="전체 약관에 동의합니다"
            >
              {/* 왼쪽 체크 아이콘 (체크박스 아님) */}
              <Feather
                name="check"
                size={S.allIcon}
                color={agreeAll ? ALL_ON_TEXT : ALL_OFF_ICON}
                style={{
                  position: 'absolute',
                  left: S.allPadH,
                }}
              />
              {/* 가운데 텍스트 */}
              <Text
                style={{
                  fontSize: scaleFont(14),
                  fontWeight: '700',
                  color: agreeAll ? ALL_ON_TEXT : ALL_OFF_TEXT,
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                전체 약관에 동의합니다
              </Text>
            </Pressable>
          </View>

          {/* ===== 필수 약관 ===== */}
          <Text
            style={{
              fontSize: S.sectionTitleSize,
              fontWeight: 'bold',
              color: '#333',
              marginTop: S.secTitleTop,
              marginBottom: S.secTitleBottom,
            }}
          >
            필수 약관
          </Text>

          <AgreementItem
            checked={agreeService}
            onToggle={() => setAgreeService(!agreeService)}
            label="서비스 이용약관 동의"
            showDetail
            onPressDetail={() => {Linking.openURL('https://achivamain.notion.site/247f9799dbb880859f08f64d81bc6335')}}
          />
          <AgreementItem
            checked={agreePrivacy}
            onToggle={() => setAgreePrivacy(!agreePrivacy)}
            label="개인정보 수집 및 이용 동의"
            showDetail
            onPressDetail={() => {Linking.openURL('https://achivamain.notion.site/247f9799dbb880b4bc53cdd088cd06db?v=247f9799dbb88051bde7000cd649a398&p=247f9799dbb8800b8057d9fe46809e08&pm=c')}}
          />
          <AgreementItem
            checked={agreeCommunity}
            onToggle={() => setAgreeCommunity(!agreeCommunity)}
            label="커뮤니티 가이드라인 동의"
            showDetail
            onPressDetail={() => {Linking.openURL('https://achivamain.notion.site/247f9799dbb88068b0f6f25469bc85c8')}}
          />
          <AgreementItem
            checked={agreeConsign}
            onToggle={() => setAgreeConsign(!agreeConsign)}
            label="개인정보 처리 위탁 동의"
            showDetail
            onPressDetail={() => {Linking.openURL('https://achivamain.notion.site/247f9799dbb880a784f6dd15a4fea5d5')}}
          />

          {/* ===== 선택 약관 ===== */}
          <Text
            style={{
              fontSize: S.sectionTitleSize,
              fontWeight: 'bold',
              color: '#333',
              marginTop: S.secTitleTop,
              marginBottom: S.secTitleBottom,
            }}
          >
            선택 약관
          </Text>

          <AgreementItem
            checked={agreeMarketing}
            onToggle={() => setAgreeMarketing(!agreeMarketing)}
            label="마케팅 정보 수신 동의"
            showDetail
            onPressDetail={() => {Linking.openURL('https://achivamain.notion.site/25df9799dbb8805ab854f0e2caf64369?source=copy_link')}}
          />
        </ScrollView>

        {/* 하단 고정 버튼 */}
        <View
          style={{
            position: 'absolute',
            left: S.side,
            right: S.side,
            bottom: S.bottomOffset,
          }}
        >
          <ConfirmButton text="다음" onPress={handleNext} disabled={!requiredAllChecked} />
        </View>
      </View>
    </ScreenContainer>
  );
}
