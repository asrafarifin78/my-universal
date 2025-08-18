// app/(stack)/profile.tsx
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Profile Screen</Text>
      <Button title="Go to About" onPress={() => router.push('/about')} />
    </View>
  );
}
