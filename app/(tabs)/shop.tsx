
import { StyleSheet, Text, View } from 'react-native';
export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Screen</Text>
      <Text style={styles.subtitle}>This is the shop section of the app.</Text>
    </View>
  );
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});
