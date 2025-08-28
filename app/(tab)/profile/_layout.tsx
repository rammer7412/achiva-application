import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="profileedit" options={{ headerShown: false, animation: 'none' }} />
    </Stack>
  );
}
