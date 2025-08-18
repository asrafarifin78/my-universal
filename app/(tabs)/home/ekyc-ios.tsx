import React, { useState } from 'react';

import { Alert, Button, NativeModules, ScrollView, Text, View } from 'react-native';

export default function EkycIOSScreen() {
  
   
  const { FaceModule } = NativeModules;

  const [ipAddress, setIpAddress] = useState('https://47.242.178.252/kyc-web');
  const [resultText, setResultText] = useState('No calls made yet.');
  const [docType, setDocType] = useState<'001' | '002' | '003'>('001');
  const [selectedLang, setSelectedLang] = useState<'en' | 'zh' | 'rw' | 'ar'>('en');
  const [isProcessing, setIsProcessing] = useState(false);

  const verifyFaceModule = () => {
    console.log('=== FaceModule Debug Info ===');
    console.log('All modules:', Object.keys(NativeModules));
    console.log('FaceModule exists:', !!FaceModule);
    if (FaceModule) {
      console.log('FaceModule methods:', Object.getOwnPropertyNames(FaceModule));
      console.log('openIdCardScan available:', typeof FaceModule.openIdCardScan);
      console.log('openPassportScan available:', typeof FaceModule.openPassportScan);
    }
    console.log('=== End Debug ===');
  };

  const openIdCardScan = async () => {
    verifyFaceModule();

    if (!FaceModule?.openIdCardScan) {
      Alert.alert('Module Error', 'openIdCardScan is not available in FaceModule');
      return;
    }

    const params = {
      ocrUrl: `${ipAddress}/sdk/main/recognize`,
      authUrl: `${ipAddress}/sdk/main/authentication`,
      docType,
      lang: selectedLang,
      idFrontTip: ipAddress,
      idBackTip: 'mobile',
      appKey: '6f105a9d0c44bf43e4a9ec1d508c9a0',
      appSecret: 'b4a79b92f479f67eb0bdb4100fd8beda',
      bodyAppKey: '6f105a9d0c44bf43e4a9ec1d508c9a0b',
      bodyAppSecret: 'b4a79b92f479f67eb0bdb4100fd8beda',
      bizId: 'not available',
      cancelButtonTitle: 'Cancel',
    };

    setIsProcessing(true);
    //try {
    const result = await new Promise((resolve, reject) => {
      devLog('openIdCardScan params:', params);
      FaceModule.openIdCardScan(params, (error: any, res: any) => {
        if (error) reject(error);
        else resolve(res);
      });
    });

    setResultText(JSON.stringify(result, null, 2));
  
  };

  const openPassportScan = async () => {
    verifyFaceModule();

    if (!FaceModule?.openPassportScan) {
      Alert.alert('Module Error', 'openPassportScan is not available in FaceModule');
      return;
    }

    try {
      const result = await new Promise((resolve, reject) => {
        FaceModule.openPassportScan({}, (error: any, res: any) => {
          if (error) reject(error);
          else resolve(res);
        });
      });

      setResultText(JSON.stringify(result, null, 2));
    } catch (error: any) {
      console.error('openPassportScan Error:', error);
      Alert.alert('Error', error.message || 'openPassportScan failed');
    }
  };

  const faceScan = async () => {

    verifyFaceModule();

    if (!FaceModule?.faceScan) {
      Alert.alert('Module Error', 'openPassportScan is not available in FaceModule');
      return;
    }

    try {
      const result = await new Promise((resolve, reject) => {
        FaceModule.faceScan({}, (error: any, res: any) => {
          if (error) reject(error);
          else resolve(res);
        });
      });

      setResultText(JSON.stringify(result, null, 2));
    } catch (error: any) {
      console.error('openPassportScan Error:', error);
      Alert.alert('Error', error.message || 'openPassportScan failed');
    }
  };

  return (
    
     

      <ScrollView className="flex-1">
        <View className="p-5">
          <View className="mb-4">
            <Button
              title="Scan ID Card (iOS)"
              onPress={openIdCardScan}
              disabled={isProcessing}
            />
          </View>

          <View className="mb-4">
            <Button
              title="Scan Passport (iOS)"
              onPress={openPassportScan}
              disabled={isProcessing}
            />
          </View>

          <View className="mb-4">
            <Button
              title="Face iD"
              onPress={faceScan}
              disabled={isProcessing}
            />
          </View>

          
          <Text className="text-sm mt-4 text-gray-500 whitespace-pre-wrap h-280">{resultText}</Text>
        </View>
      </ScrollView>
    
  );
}
