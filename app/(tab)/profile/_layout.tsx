import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="options" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="edit" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="accountmanage" options={{ headerShown: false, animation: 'none' }} />
    </Stack>
  );
}
