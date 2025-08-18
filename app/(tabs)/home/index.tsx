// app/(tabs)/home/index.tsx

import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView>
        <View style={styles.container}>
            <View style={styles.card}>
                <Image
                    style={styles.image}
                    source={require('../../../assets/images/icon-ios.png')}
                />
                 <View style={styles.textContainer}>
                    <Text style={styles.title}>Universal APP</Text>
                    <Text style={styles.subtitle}>
                        EKYC Test simulator.
                    </Text>
                </View>
            </View>
            <View style={styles.cardLink}>
                <TouchableOpacity
                  style={styles.buttonLayout}
                  onPress={() => router.push('/(tabs)/home/details')}
                >
                    <Text style={styles.buttonText}>Go to Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonLayout}
                  onPress={() => router.push('/(tabs)/home/ekyc-ios')}
                >
                    <Text style={styles.buttonText}>Go to iOS eKYC</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonLayout}
                  onPress={() => router.push('/(tabs)/home/ekyc-android')}
                >
                    <Text style={styles.buttonText}>Go to Android eKYC</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
  );
   
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    
  },
   card: {
    flexDirection: "row", // places image and text side by side
    alignItems: "center",
    marginTop: 32,
    padding: 12,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
   image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1, // ensures text takes remaining space
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937", // gray-800
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280", // gray-500
  },
  cardLink :{
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f3f4f6", // gray-200
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    margin: 8,
    width: '90%',
  },
  buttonLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#3b82f6', // blue-500
    marginVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },    
});


{/*<ScrollView className="flex-1 bg-white">
        
            <View className='box-border-red-100 border-2 m-4 rounded-3xl shadow-lg  m-2'>
                <View className="flex-row h-20 w-full justify-center items-center">
                    <Text className="flex-1 text-base font-bold text-blue-600 bg-red-100">Home Screen1</Text>
                    <Text className="flex-1 text-base font-bold text-blue-600 bg-blue-100">Home Screen1</Text>
                </View>
            </View>
            <View className='box-border-red-100 h-20 border-2 m-4 rounded-3xl shadow-lg m-2 flex-row items-space-around'>
                <Pressable
                    className="flex-1 bg-blue-500 rounded-lg items-center justify-center m-3"
                    onPress={() => router.push("/(tabs)/home/details")}>
                    <Text className="text-white">Go to Details</Text>
                </Pressable>
                    
                <Pressable
                    className="flex-1 bg-blue-500 rounded-lg items-center justify-center m-3"
                    onPress={() => router.push("/(tabs)/home/details")}>
                    <Text className="text-white">Go to Details</Text>
                </Pressable>
            
            </View>

    </ScrollView>*/}