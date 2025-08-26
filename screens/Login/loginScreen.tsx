// // @/screens/LoginScreen.tsx
// import ConfirmButton from '@/components/buttons/ConfirmButton';
// import PasswordInput from '@/components/InputBox/PasswordInput';
// import SimpleInput from '@/components/InputBox/SimpleInput';
// import ACHIVALogo from '@/components/logo/ACHIVA-logo';
// import ScreenContainer from '@/components/ScreenContainer';
// import NormalText from '@/components/text/NormalText';
// import TitleWithBack from '@/components/TitleWithBack';
// import { useAuthStore, User } from '@/stores/useAuthStore';
// import { authApi } from '@/utils/authApi';
// import { useResponsiveSize } from '@/utils/ResponsiveSize';
// import { saveTokens } from '@/utils/secureToken';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showInlineError, setShowInlineError] = useState(false); // 고정 인라인 에러
//   const [debugToken, setDebugToken] = useState<string | null>(null); // DEV 전용 토큰 프리뷰
//   const router = useRouter();
//   const { scaleHeight, scaleWidth, scaleFont } = useResponsiveSize();
//   const { setAuth, setUser } = useAuthStore();

//   // 'Bearer xxx' → 'xxx' 로 추출
//   const stripBearer = (raw?: string | null) => {
//     if (!raw) return null;
//     const s = String(raw);
//     const m = s.match(/Bearer\s+(.+)/i);
//     return m ? m[1] : s;
//   };

//   const handleLogin = async () => {
//     const emailTrim = email.trim();
//     const passwordTrim = password.trim();

//     if (!emailTrim || !passwordTrim) {
//       setShowInlineError(true);
//       return;
//     }

//     try {
//       setLoading(true);
//       setShowInlineError(false);

//       // 1) 로그인 요청
//       const res = await authApi.post(
//         '/api/auth/login',
//         { email: emailTrim, password: passwordTrim },
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       // 2) 헤더/바디에서 accessToken 추출
//       const headerAuth =
//         (res?.headers && (res.headers['authorization'] || (res.headers as any).Authorization)) || null;
//       const tokenFromHeader = stripBearer(headerAuth);
//       const tokenFromBody =
//         res?.data?.data?.accessToken ??
//         res?.data?.accessToken ??
//         res?.data?.token ??
//         res?.data?.jwt ??
//         null;

//       const accessToken = tokenFromHeader ?? tokenFromBody;

//       // (선택) refreshToken도 바디에서 추출되면 함께 저장
//       const refreshFromBody =
//         res?.data?.data?.refreshToken ??
//         res?.data?.refreshToken ??
//         null;

//       if (!accessToken) {
//         if (__DEV__) {
//           console.log('[Login] status =', res?.status);
//           console.log('[Login] headers =', res?.headers);
//           console.log('[Login] data =', res?.data);
//           console.log('[Login] ❌ Token not found in header/body');
//         }
//         setShowInlineError(true);
//         return;
//       }

//       // 3) 바디에 유저 필드가 “그대로” 오는 API가 아니어서, 최소 User 스키마로 안전 변환
//       const raw = (res?.data?.data ?? {}) as any;
//       const userFromBody: User = {
//         id: Number(raw?.id) || 0,
//         email: String(raw?.email || emailTrim),
//         nickName: String(raw?.nickName || ''),
//         profileImageUrl: raw?.profileImageUrl || undefined,
//       };

//       // 4) 전역 상태/헤더/보안 저장
//       setAuth(accessToken, userFromBody, refreshFromBody ?? null);

//       // 인터셉터가 붙이지만, 혹시 모를 초기 상태 대비로 기본 헤더도 보강
//       (authApi.defaults.headers as any).common = (authApi.defaults.headers as any).common || {};
//       authApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

//       await saveTokens(accessToken, refreshFromBody ?? null);

//       // 5) 실제 인증 확인 및 유저 갱신(/me)
//       const me = await authApi.get('/api/members/me');
//       const meData = (me?.data?.data ?? {}) as any;
//       const userFromMe: User = {
//         id: Number(meData?.id) || userFromBody.id,
//         email: String(meData?.email || userFromBody.email),
//         nickName: String(meData?.nickName || userFromBody.nickName),
//         profileImageUrl: meData?.profileImageUrl || userFromBody.profileImageUrl,
//       };
//       setUser(userFromMe);

//       // 6) DEV 로그/프리뷰
//       if (__DEV__) {
//         console.log('🟢 token =', accessToken);
//         console.log('🟢 res.status =', res?.status);
//         console.log('🟢 res.headers =', res?.headers);
//         console.log('🟢 res.data =', res?.data);
//         console.log('🟢 /me =', me.data);
//         setDebugToken(accessToken);
//       }

//       // 7) 라우팅
//       router.replace('/(tabs)/home');
//     } catch (error: any) {
//       if (__DEV__) console.log('❌ 로그인 오류:', error?.response?.data || error?.message || error);
//       setShowInlineError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onChangeEmail = (t: string) => {
//     setEmail(t);
//     if (showInlineError) setShowInlineError(false);
//   };
//   const onChangePassword = (t: string) => {
//     setPassword(t);
//     if (showInlineError) setShowInlineError(false);
//   };

//   const isDisabled = loading || email.trim() === '' || password.trim() === '';

//   return (
//     <ScreenContainer>
//       <View
//         style={{
//           flex: 1,
//           paddingHorizontal: scaleWidth(24),
//           backgroundColor: '#fff',
//         }}
//       >
//         <TitleWithBack title="로그인" />

//         <View
//           style={{
//             marginVertical: scaleHeight(64),
//             alignItems: 'center',
//           }}
//         >
//           <ACHIVALogo color="#4B2E2E" />
//         </View>

//         <View
//           style={{
//             gap: scaleHeight(12),
//             marginBottom: scaleHeight(16),
//           }}
//         >
//           <SimpleInput
//             placeholder="이메일 입력"
//             value={email}
//             onChangeText={onChangeEmail}
//             keyboardType="email-address"
//           />
//           {showInlineError && (
//             <Text style={{ marginTop: scaleHeight(4), color: '#C0392B', fontSize: scaleFont(12) }}>
//               이메일 또는 비밀번호를 확인해주세요.
//             </Text>
//           )}

//           <PasswordInput
//             placeholder="비밀번호 입력"
//             value={password}
//             onChangeText={onChangePassword}
//             backgroundColor="#FFFFFF"
//           />
//           {showInlineError && (
//             <Text style={{ marginTop: scaleHeight(4), color: '#C0392B', fontSize: scaleFont(12) }}>
//               이메일 또는 비밀번호를 확인해주세요.
//             </Text>
//           )}

//           <ConfirmButton
//             text={loading ? '로그인 중...' : '로그인'}
//             onPress={handleLogin}
//             disabled={isDisabled}
//           />

//           <TouchableOpacity onPress={() => router.push('/findpwinputemail')}>
//             <Text
//               style={{
//                 marginTop: scaleHeight(16),
//                 textAlign: 'center',
//                 color: '#888',
//                 fontSize: scaleFont(16),
//                 textDecorationLine: 'underline',
//               }}
//             >
//               비밀번호 찾기
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginVertical: scaleHeight(20),
//           }}
//         >
//           <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
//           <Text
//             style={{
//               marginHorizontal: scaleWidth(12),
//               color: '#666',
//               fontSize: scaleFont(13),
//             }}
//           >
//             또는
//           </Text>
//           <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
//         </View>

//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'center',
//             gap: scaleWidth(36),
//             marginBottom: scaleHeight(24),
//           }}
//         >
//           <TouchableOpacity
//             style={{
//               width: scaleWidth(52),
//               height: scaleWidth(52),
//               borderRadius: scaleWidth(104),
//               borderWidth: 1,
//               borderColor: '#ccc',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Ionicons name="logo-google" size={scaleFont(24)} color="#555" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{
//               width: scaleWidth(52),
//               height: scaleWidth(52),
//               borderRadius: scaleWidth(104),
//               borderWidth: 1,
//               borderColor: '#ccc',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Ionicons name="logo-apple" size={scaleFont(24)} color="#555" />
//           </TouchableOpacity>
//         </View>

//         <NormalText>소셜 계정으로 ACHIVA에 로그인 하세요</NormalText>

//         {/* DEV 전용 토큰 미리보기(안전 위해 앞부분만) */}
//         {__DEV__ && !!debugToken && (
//           <View
//             style={{
//               marginTop: scaleHeight(12),
//               paddingVertical: scaleHeight(8),
//               paddingHorizontal: scaleWidth(12),
//               backgroundColor: '#F8F9FA',
//               borderRadius: 8,
//               borderWidth: 1,
//               borderColor: '#EEE',
//             }}
//           >
//             <Text style={{ color: '#666', fontSize: scaleFont(12) }}>
//               token(preview): {debugToken.slice(0, 18)}…
//             </Text>
//           </View>
//         )}
//       </View>
//     </ScreenContainer>
//   );
// }
