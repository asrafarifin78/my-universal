import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import FaceSDK from './FaceSDK';

interface SDKResponse {
  code: string;
  message: string;
  transactionId?: string;
  bizId?: string;
  idNumber?: string;
  name?: string;
  filepath?: string;
}

export default function EkycAndroidScreen() {
  const [ipAddress, setIpAddress] = useState('https://47.242.178.252/kyc-web');
  const [resultText, setResultText] = useState('No calls made yet.');
  const [transId, setTransId] = useState<string | null>(null);
  const [bizId, setBizId] = useState<string | null>(null);
  const [docType, setDocType] = useState<'001' | '002' | '003'>('001');
  const [selectedLang, setSelectedLang] = useState<'en' | 'zh' | 'rw' | 'ar'>('en');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOcr = async () => {
    if (isProcessing) {
      Alert.alert('Processing', 'Please wait for the current operation to complete.');
      return;
    }
    setIsProcessing(true);
    setResultText('Launching OCR recognition...');
    try {
      const options = {
        ocrUrl: `${ipAddress}/sdk/main/recognize`,
        authUrl: `${ipAddress}/sdk/main/authentication`,
        docType,
        lang: selectedLang,
        idFrontTip: ipAddress,
        idBackTip: 'mobile',
      };

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('OCR operation timed out')), 60000);
      });

      const response = (await Promise.race([
        FaceSDK.launchOcr(options),
        timeoutPromise,
      ])) as SDKResponse;

      setResultText(JSON.stringify(response, null, 2));

      if (response?.transactionId) {
        setTransId(response.transactionId);
        if (response.bizId) setBizId(response.bizId);
        else Alert.alert('OCR Success', 'BizId not returned.');
      } else {
        Alert.alert('OCR Complete', `Message: ${response.message}`);
      }
    } catch (error: any) {
      console.error('OCR Error:', error);
      const errorMessage = error?.message || 'An unknown error occurred.';
      setResultText(`OCR Failed: ${errorMessage}`);
      Alert.alert('OCR Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegister = async () => {
    if (isProcessing) {
      Alert.alert('Processing', 'Please wait for the current operation to complete.');
      return;
    }
    setIsProcessing(true);
    setResultText('Launching face registration...');
    try {
      const options = {
        authUrl: `${ipAddress}/sdk/main/authentication`,
        baseUrl: ipAddress,
        mode: 1 as const,
        checkItem: 7 as const,
        camerFacingOn: 3,
        camerFacingDefault: 5,
        imgQuality: 80,
        imgMaxSize: 300,
        debug: true,
        lang: 'en' as const,
        threshold: 0.9,
      };

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Face registration timed out')), 60000);
      });

      const response = (await Promise.race([
        FaceSDK.launchFace(options),
        timeoutPromise,
      ])) as SDKResponse;

      setResultText(JSON.stringify(response, null, 2));
      Alert.alert('Registration Complete', `Message: ${response.message}`);
    } catch (error: any) {
      console.error('Registration Error:', error);
      const errorMessage = error?.message || 'An unknown error occurred.';
      setResultText(`Registration Failed: ${errorMessage}`);
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompare = async () => {
    if (isProcessing) {
      Alert.alert('Processing', 'Please wait for the current operation to complete.');
      return;
    }
    if (!transId) {
      Alert.alert('Error', 'Please perform OCR recognition first to get a Transaction ID.');
      return;
    }

    setIsProcessing(true);
    setResultText('Launching face comparison...');
    try {
      const options = {
        authUrl: `${ipAddress}/sdk/main/authentication`,
        compareUrl: `${ipAddress}/sdk/main/compare`,
        baseUrl: ipAddress,
        mode: 0 as const,
        checkItem: 7 as const,
        lang: 'en' as const,
        bizId,
        transactionId: transId,
        debug: false,
        mImgQuality: 100,
        imgMaxSize: 300,
      };

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Face comparison timed out')), 60000);
      });

      const response = (await Promise.race([
        FaceSDK.launchFace(options),
        timeoutPromise,
      ])) as SDKResponse;

      setResultText(JSON.stringify(response, null, 2));
      Alert.alert('Comparison Complete', `Message: ${response.message}\nCode: ${response.code}`);
    } catch (error: any) {
      console.error('Comparison Error:', error);
      const errorMessage = error?.message || 'An unknown error occurred.';
      setResultText(`Comparison Failed: ${errorMessage}`);
      Alert.alert('Comparison Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Service URL (IP/Domain):</Text>
      <TextInput
        style={styles.input}
        value={ipAddress}
        onChangeText={setIpAddress}
        placeholder="e.g., https://xxx.xxx.xxx.xxx/kyc-web"
      />

      <Text style={styles.label}>Select Document Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={docType} onValueChange={(value) => setDocType(value)}>
          <Picker.Item label="ID Card" value="001" />
          <Picker.Item label="Passport" value="002" />
          <Picker.Item label="Driver's License" value="003" />
        </Picker>
      </View>

      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedLang} onValueChange={(value) => setSelectedLang(value)}>
          <Picker.Item label="English (en)" value="en" />
          <Picker.Item label="中文 (zh)" value="zh" />
          <Picker.Item label="Kinyarwanda (rw)" value="rw" />
          <Picker.Item label="العربیة (ar)" value="ar" />
        </Picker>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status:</Text>
        <Text style={styles.statusText}>Transaction ID: {transId || 'Not available'}</Text>
        <Text style={styles.statusText}>BizId: {bizId || 'Not available'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isProcessing ? 'Processing...' : '1. Perform OCR Recognition'}
          onPress={handleOcr}
          disabled={isProcessing}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isProcessing ? 'Processing...' : '2. Perform Face Compare'}
          onPress={handleCompare}
          disabled={isProcessing || !transId}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isProcessing ? 'Processing...' : 'Standalone: Face Registration'}
          onPress={handleRegister}
          color="#28a745"
          disabled={isProcessing}
        />
      </View>

      <Text style={styles.resultTitle}>Result:</Text>
      <Text style={styles.resultText} selectable>{resultText}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  resultTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    fontFamily: 'monospace',
    marginTop: 10,
    minHeight: 100,
    padding: 10,
  },
  statusContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 2,
  },
});