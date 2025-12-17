import { Stack } from 'expo-router';

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="room/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]/resources" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]/whiteboard" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]/notes" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]/call" options={{ headerShown: false }} />
      <Stack.Screen name="room/create" options={{ headerShown: false }} />
    </Stack>
  );
}
