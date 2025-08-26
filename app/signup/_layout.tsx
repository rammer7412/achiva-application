import { Stack } from 'expo-router';

export default function SignupStackLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index"/>
    </Stack>
  );
}
