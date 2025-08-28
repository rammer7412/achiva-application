import { login } from '@/api/auth';
import { getMe } from '@/api/users';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import { ScreenContainer } from '@/components/containers/ScreenContainer';
import TitleWithBack from '@/components/header/TitleWithBack';
import PasswordInput from '@/components/inputbox/PasswordInput';
import SimpleInput from '@/components/inputbox/SimpleInput';
import ACHIVALogo from '@/components/logo/ACHIVA-logo';
import { ThinText } from '@/components/text/TextWithNode';
import { useAuthStore } from '@/stores/useAuthStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
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
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleWidth(24),
          backgroundColor: '#fff',
        }}
      >
        <TitleWithBack title="로그인" />

        <View
          style={{
            marginVertical: scaleHeight(64),
            alignItems: 'center',
          }}
        >
          <ACHIVALogo color="#412A2A" />
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
          
          {/* //TODO -  */}
          <TouchableOpacity onPress={() => router.push('/')}> 
            <Text
              style={{
                marginTop: scaleHeight(16),
                textAlign: 'center',
                color: '#888',
                fontSize: scaleFont(16),
                textDecorationLine: 'underline',
              }}
            >
              비밀번호 찾기
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: scaleHeight(20),
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
          <Text
            style={{
              marginHorizontal: scaleWidth(12),
              color: '#666',
              fontSize: scaleFont(13),
            }}
          >
            또는
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: scaleWidth(36),
            marginBottom: scaleHeight(24),
          }}
        >
          <TouchableOpacity
            style={{
              width: scaleWidth(52),
              height: scaleWidth(52),
              borderRadius: scaleWidth(104),
              borderWidth: 1,
              borderColor: '#ccc',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="logo-google" size={scaleFont(24)} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: scaleWidth(52),
              height: scaleWidth(52),
              borderRadius: scaleWidth(104),
              borderWidth: 1,
              borderColor: '#ccc',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="logo-apple" size={scaleFont(24)} color="#555" />
          </TouchableOpacity>
        </View>

        <ThinText>소셜 계정으로 ACHIVA에 로그인 하세요</ThinText>
      </View>
    </ScreenContainer>
  );
}
