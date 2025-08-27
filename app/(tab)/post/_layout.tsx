import { Stack } from 'expo-router';

export default function PostStackLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="choosecontents" options={{ headerShown: false, animation: 'none' }} />
    </Stack>
  );
}
