import { Stack } from 'expo-router';

export default function SignupStackLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="accountagree"/>
      <Stack.Screen name="birthinput"/>
      <Stack.Screen name="categorychoose"/>
      <Stack.Screen name="createpw"/>
      <Stack.Screen name="finishsignup"/>
      <Stack.Screen name="emailauth"/>
      <Stack.Screen name="pledge"/>
      <Stack.Screen name="profilechoose"/>
      <Stack.Screen name="usernameinput"/>
    </Stack>
  );
}
