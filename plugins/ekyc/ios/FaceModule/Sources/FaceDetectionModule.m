#import "FaceDetectionModule.h"
#import <React/RCTUtils.h>

@implementation FaceDetectionModule

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"FaceDetectionResult"];
}

RCT_EXPORT_METHOD(startFaceDetection:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootViewController = RCTKeyWindow().rootViewController;
    
    // Initialize face detection controller
    NSURL *baseURL = [NSURL URLWithString:options[@"baseURL"]];
    NSString *appKey = options[@"appKey"];
    NSString *appSecret = options[@"appSecret"];
    
    IWFaceDetectViewController *faceController = 
      [[IWFaceDetectViewController alloc] 
        initWithMode:IWFaceDetectForModeFaceLiveing
        baseURL:baseURL
        appKey:appKey
        appSecret:appSecret
        baseImage:nil
        cameraFacingOn:CameraFacingFront];
    
    faceController.handler = ^(NSDictionary *userInfo, NSError *error) {
      if (error) {
        reject(@"FACE_DETECTION_ERROR", error.localizedDescription, error);
      } else {
        resolve(userInfo);
      }
      
      dispatch_async(dispatch_get_main_queue(), ^{
        [rootViewController dismissViewControllerAnimated:YES completion:nil];
      });
    };
    
    [rootViewController presentViewController:faceController animated:YES completion:nil];
  });
}

/*RCT_EXPORT_METHOD(openIdCardScan:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
                    */
RCT_EXPORT_METHOD(openIdCardScan:(NSDictionary *)param callback:(RCTResponseSenderBlock)callback) {
   NSLog(@"openIdCardScan called with options: %@", param);
   
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootViewController = RCTKeyWindow().rootViewController;
    
    NSString *authUrl = @"https://47.242.178.252/kyc-web/sdk/main/authentication";
    NSString *ocrUrl = @"https://47.242.178.252/kyc-web/sdk/main/recognize";
    NSString *appKey = @"6f105a9d0c44bf43e4a9ec1d508c9a0b";
   NSString *appSecret = @"b4a79b92f479f67eb0bdb4100fd8beda";
   NSString *bodyAppKey = @"6f105a9d0c44bf43e4a9ec1d508c9a0b";
   NSString *bodyAppSecret = @"b4a79b92f479f67eb0bdb4100fd8beda";
   NSString *lang = @"en";
   NSString *bizId = @"";
   NSString *idCardFrontTip = @"idCardFrontTip";
   NSString *idCardBackTip = @"idCardBackTip";
   NSString *cancelButtonTitle = @"cancelButtonTitle";

    IWFaceDetectViewController *faceController = 
      [[IWFaceDetectViewController alloc] 
        initOCRIdCardMode:IWFaceDetectForModeOCRIdCard
        authUrl:[NSURL URLWithString:authUrl]
        ocrUrl:[NSURL URLWithString:ocrUrl]
        appKey:appKey
        appSecret:appSecret
        bodyAppKey:bodyAppKey
        bodyAppSecret:bodyAppSecret
        lang:lang
        bizId:bizId
        idCardFrontTip:idCardFrontTip
        idCardBackTip:idCardBackTip
        cancelButtonTitle:cancelButtonTitle];
        

    NSLog(@"FaceController: %@", faceController);
    fprintf(stderr, "📢 fprintf: This also prints reliably\n");
    faceController.handler = ^(NSDictionary *userInfo, NSError *error) {
      if (error) {
        NSLog(@"OCR ID Card Error: %@", error);
        
          callback(@[@"OCR_ID_CARD_ERROR"]);
        //reject(@"OCR_ID_CARD_ERROR", error.localizedDescription, error);
      } else {
          
          NSError *jsonError = nil;
          NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfo 
              options:NSJSONWritingPrettyPrinted 
              error:&jsonError];

          if (!jsonData || jsonError) {
              NSLog(@"JSON serialization error: %@", jsonError);
              callback(@[jsonError ?: @"JSON serialization failed"]);
              return;
          }

          NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
          if (!resultString) {
              NSLog(@"String conversion error: %@",resultString);
              callback(@[@"String conversion failed"]);
              return;
          }
          NSLog(@"OCR Result: %@", resultString);
          NSLog(@"User Info: %@", userInfo);
          //callback(@[[NSNull null], resultString]);
        callback(userInfo);
      }
      
      /*dispatch_async(dispatch_get_main_queue(), ^{
        [rootViewController dismissViewControllerAnimated:YES completion:nil];
      });*/
    };
    
    //[rootViewController presentViewController:faceController animated:YES completion:nil];
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
        if (window.rootViewController) {
            [window.rootViewController presentViewController:faceController animated:YES completion:nil];
        } else {
            callback(@[@"Root view controller is nil"]);
        }
    });
}

RCT_EXPORT_METHOD(openPassportScan:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootViewController = RCTKeyWindow().rootViewController;
    
    NSString *authUrl = options[@"authUrl"];
    NSString *ocrUrl = options[@"ocrUrl"];
    NSString *appKey = options[@"appKey"];
    NSString *appSecret = options[@"appSecret"];
    NSString *bodyAppKey = options[@"bodyAppKey"];
    NSString *bodyAppSecret = options[@"bodyAppSecret"];
    NSString *lang = options[@"lang"] ?: @"en";
    NSString *bizId = options[@"bizId"];
    
    IWFaceDetectViewController *faceController = 
      [[IWFaceDetectViewController alloc] 
        initOCRPassportMode:IWFaceDetectForModeOCRPassPort
        authUrl:[NSURL URLWithString:authUrl]
        ocrUrl:[NSURL URLWithString:ocrUrl]
        appKey:appKey
        appSecret:appSecret
        bodyAppKey:bodyAppKey
        bodyAppSecret:bodyAppSecret
        lang:lang
        bizId:bizId
        passportTip:options[@"passportTip"] ?: @""
        cancelButtonTitle:options[@"cancelButtonTitle"] ?: @"Cancel"];
    
    faceController.handler = ^(NSDictionary *userInfo, NSError *error) {
      if (error) {
        reject(@"OCR_PASSPORT_ERROR", error.localizedDescription, error);
      } else {
        resolve(userInfo);
      }
      
      dispatch_async(dispatch_get_main_queue(), ^{
        [rootViewController dismissViewControllerAnimated:YES completion:nil];
      });
    };
    
    [rootViewController presentViewController:faceController animated:YES completion:nil];
  });
}

@end
