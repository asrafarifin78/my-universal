import { NativeModules, Platform } from 'react-native';

const { FaceSDKModule } = NativeModules;

if (Platform.OS === 'android') {
  if (!FaceSDKModule) {
    throw new Error('FaceSDKModule is not available. Did you link the native module correctly?');
  }
}
// Face recognition parameter type (updated to match native code)
interface FaceSDKOptions {
  authUrl?: string;
  compareUrl?: string;
  baseUrl?: string;
  mode: 0 | 1;
  checkItem: 1 | 3 | 6 | 7;
  camerFacingOn?: number;
  camerFacingDefault?: number;
  imgQuality?: number;
  imgMaxSize?: number;
  debug?: boolean;
  lang: 'en' | 'zh' | 'rw' | 'ar';
  threshold?: number;
  bizId?: string;
  transactionId?: string;
  mImgQuality?: number;
}
// [FIXED] OCR parameter type with more flexible lang parameter
interface OcrSDKOptions {
  ocrUrl: string;
  authUrl: string;
  docType: '001' | '002' | '003';
  lang: 'en' | 'zh' | 'rw' | 'ar';
  bizId?: string; // <-- Made optional for OCR (not required)
  imgMaxSize?: number;
  mImgQuality?: number;
  idFrontTip?: string;
  idBackTip?: string;
}
// Generic result type (updated to include bizId)
interface SDKResult {
  code: string;
  message: string;
  transactionId?: string;
  bizId?: string; // Add bizId field
  idNumber?: string;
  name?: string;
  filepath?: string;
}
/**
 * Launch face recognition/registration UI
 */
const launchFace = (options: FaceSDKOptions): Promise<SDKResult> => {
  if (Platform.OS === 'android') {
    return FaceSDKModule.launchFaceActivity(options);
  }
};
/**
 * [FIXED] Launch OCR recognition UI
 */
const launchOcr = (options: OcrSDKOptions): Promise<SDKResult> => {
  if (Platform.OS === 'android') {
    return FaceSDKModule.launchOcrActivity(options);
  }
};
export default {
  launchFace,
  launchOcr,
};
