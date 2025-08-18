// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="ekyc-ios" 
        options={{ 
          title: 'iOS eKYC' 
        }} 
      />
      <Stack.Screen 
        name="ekyc-android" 
        options={{ 
          title: 'Android eKYC' 
        }} 
      />
    </Stack>
  );
}
