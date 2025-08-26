import { Stack } from 'expo-router';

export default function LoginStackLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
