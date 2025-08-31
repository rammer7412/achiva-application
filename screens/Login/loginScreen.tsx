import { login } from '@/api/auth';
import { getMe } from '@/api/users';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import TitleWithBack from '@/components/header/TitleWithBack';
import PasswordInput from '@/components/inputbox/PasswordInput';
import SimpleInput from '@/components/inputbox/SimpleInput';
import ACHIVALogo from '@/components/logo/ACHIVA-logo';
import { useAuthStore } from '@/stores/useAuthStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInlineError, setShowInlineError] = useState(false);
  const router = useRouter();
  const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();

  const stripBearer = (raw?: string | null) => {
    if (!raw) return null;
    const m = String(raw).match(/Bearer\s+(.+)/i);
    return m ? m[1] : String(raw);
  };

  const handleLogin = async () => {
    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    if (!emailTrim || !passwordTrim) {
      setShowInlineError(true);
      return;
    }

    try {
      setLoading(true);
      setShowInlineError(false);

      const loginRes = await login(
        { email: emailTrim, password: passwordTrim },
        { headers: { 'Content-Type': 'application/json' }}
      );

      if (loginRes?.data.code !== 200) {
        setShowInlineError(true);
        return;
      }

      const authHeader =
        (loginRes.headers as any)?.get?.('authorization') ??
        loginRes.headers['Authorization'];
        
      const accessToken = stripBearer(authHeader);
      const {setTokens} = useAuthStore.getState();
      setTokens(accessToken);

      const { setUser } = useAuthStore.getState();
      const meRes = await getMe();

      if (meRes?.status === 'success' && meRes.data) {
        const meResData = meRes.data;
        setUser({
          id: meResData.id,
          email: meResData.email,
          nickName: meResData.nickName, 
          birth: meResData.birth,
          gender: meResData.gender,
          region: meResData.region,
          categories: meResData.categories ?? [],
          profileImageUrl: meResData.profileImageUrl,
          description: meResData.description,
          role: meResData.role,
          createdAt: meResData.createdAt,
        });
      }
      
      router.replace('/(tab)/home');
    } catch (err: any) {
      if (__DEV__) console.log('❌ 로그인 오류:', err?.response?.data || err?.message || err);
      setShowInlineError(true);
    } finally {
      setLoading(false);
    }
  };


 

  const onChangeEmail = (t: string) => {
    setEmail(t);
    if (showInlineError) setShowInlineError(false);
  };
  const onChangePassword = (t: string) => {
    setPassword(t);
    if (showInlineError) setShowInlineError(false);
  };

  const isDisabled = loading || email.trim() === '' || password.trim() === '';
  
  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: scaleWidth(24) }}>
        <TitleWithBack title='로그인'/>
        <View
          style={{
            flex: 1,
            paddingHorizontal: scaleWidth(24),
            backgroundColor: '#fff',
          }}
        >
          

          <View
            style={{
              marginVertical: scaleHeight(64),
              alignItems: 'center',
            }}
          >
            <ACHIVALogo/>
          </View>

          <View
            style={{
              gap: scaleHeight(12),
              marginBottom: scaleHeight(16),
            }}
          >
            <SimpleInput
              placeholder="이메일 입력"
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
            />
            {showInlineError && (
              <Text style={{ marginTop: scaleHeight(4), color: '#C0392B', fontSize: scaleFont(12) }}>
                이메일 또는 비밀번호를 확인해주세요.
              </Text>
            )}

            <PasswordInput
              placeholder="비밀번호 입력"
              value={password}
              onChangeText={onChangePassword}
              backgroundColor="#FFFFFF"
            />
            {showInlineError && (
              <Text style={{ marginTop: scaleHeight(4), color: '#C0392B', fontSize: scaleFont(12) }}>
                이메일 또는 비밀번호를 확인해주세요.
              </Text>
            )}

            <ConfirmButton
              text={loading ? '로그인 중...' : '로그인'}
              onPress={handleLogin}
              disabled={isDisabled}
            />
            
            <View
              style={{
                marginTop: scaleHeight(12),
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  color: '#8E8E93',
                  fontSize: scaleFont(16),
                  marginRight: scaleWidth(8),
                }}
              >
                비밀번호를 잊으셨나요?
              </Text>

              <TouchableOpacity
                onPress={() => router.push('/')} // TODO: 실제 라우트로 교체
                accessibilityRole="button"
                hitSlop={{
                  top: scaleHeight(6),
                  bottom: scaleHeight(6),
                  left: scaleWidth(6),
                  right: scaleWidth(6),
                }}
              >
                <Text
                  style={{
                    color: '#111111',
                    fontSize: scaleFont(16),
                    fontWeight: '700',
                  }}
                >
                  비밀번호 찾기
                </Text>
              </TouchableOpacity>
            </View>


          </View>

        </View>
      </View>
      
    </ScreenContainer>
  );
}
