//
//  FaceModule.mm
//  expoBase
//
//  Created by jin xm on 2025/2/18.
//

#import <Foundation/Foundation.h>
#import "FaceModule.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#if !(TARGET_IPHONE_SIMULATOR)
#import "IWFaceDetectViewController.h"
#else
#import "IWFaceDetectViewController.h"
#endif

#define ImgQuality      0.2
#define Threshold       0.9

#ifdef DEBUG_MODE
#define AIAppKey        @"6f105a9d0c44bf43e4a9ec1d508c9a0b"
#define AIAppSecret     @"b4a79b92f479f67eb0bdb4100fd8beda"
#define AIBodyAppKey    @"6f105a9d0c44bf43e4a9ec1d508c9a0b"
#define AIBodyAppSecret @"b4a79b92f479f67eb0bdb4100fd8beda"
#define AIRecognizeUrl  @"http://10.45.46.129:8021/kyc-web/sdk/main/recognize"
#define AIAuthUrl       @"http://10.45.46.129:8021/kyc-web/sdk/main/authentication"
#define AICompareUrl    @"http://10.45.46.129:8021/kyc-web/sdk/main/compare"
#define AIBaseUrl       @"https://47.242.178.252/kyc-web"
#else
#define AIAppKey        @"6f105a9d0c44bf43e4a9ec1d508c9a0b"
#define AIAppSecret     @"b4a79b92f479f67eb0bdb4100fd8beda"
#define AIBodyAppKey    @"6f105a9d0c44bf43e4a9ec1d508c9a0b"
#define AIBodyAppSecret @"b4a79b92f479f67eb0bdb4100fd8beda"
#define AIRecognizeUrl  @"https://47.242.178.252/kyc-web/sdk/main/recognize"
#define AIAuthUrl       @"https://47.242.178.252/kyc-web/sdk/main/authentication"
#define AICompareUrl    @"https://47.242.178.252/kyc-web/sdk/main/compare"
#define AIBaseUrl       @"https://47.242.178.252/kyc-web"
#endif

@interface FaceModule ()
#if !(TARGET_IPHONE_SIMULATOR)
@property (nonatomic, strong) IWFaceDetectViewController *faceVC;
@property (nonatomic, copy) NSString *transactionId;
#endif
@end

@implementation FaceModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        NSLog(@"🔥 FaceModule loaded in native code!");
    }
    return self;
}


RCT_EXPORT_METHOD(openIdCardScan:(NSDictionary *)param callback:(RCTResponseSenderBlock)callback) {
    
     
     dispatch_async(dispatch_get_main_queue(), ^{
       /* NSURL *authUrl = [NSURL URLWithString:AIAuthUrl];
        NSURL *ocrUrl = [NSURL URLWithString:AIRecognizeUrl];

        NSString *appKey = AIAppKey;
        NSString *appSecret = AIAppSecret;
        NSString *bodyAppKey = AIBodyAppKey;
        NSString *bodyAppSecret = AIBodyAppSecret;
        NSString *lang = @"en";
        NSString *bizId = @"not available";
        NSString *idCardFrontTip = AIBaseUrl;
        NSString *idCardBackTip = @"mobile";
        NSString *cancelButtonTitle = @"Cancel";
        */
       NSURL *authUrl = [NSURL URLWithString:@"https://47.242.178.252/kyc-web/sdk/main/authentication"];
       NSURL *ocrUrl = [NSURL URLWithString:@"https://47.242.17.252/kyc-web/sdk/main/recognize"];
      NSString *appKey = @"6f105a9d0c44bf43e4a9ec1d508c9a0b";
      NSString *appSecret = @"b4a79b92f479f67eb0bdb4100fd8beda";
      NSString *bodyAppKey = @"6f105a9d0c44bf43e4a9ec1d508c9a0b";
      NSString *bodyAppSecret = @"b4a79b92f479f67eb0bdb4100fd8beda";
      NSString *lang = @"en";
      NSString *bizId = @"123";
      NSString *idCardFrontTip = @"idCardFrontTip";
      NSString *idCardBackTip = @"idCardBackTip";
      NSString *cancelButtonTitle = @"cancelButtonTitle";

       
        NSLog(@"initOCRIdCardMode params:\n authUrl: %@\n ocrUrl: %@\n appKey: %@\n appSecret: %@\n bodyAppKey: %@\n bodyAppSecret: %@\n lang: %@\n bizId: %@\n idCardFrontTip: %@\n idCardBackTip: %@\n cancelButtonTitle: %@",
      authUrl, ocrUrl, appKey, appSecret, bodyAppKey, bodyAppSecret, lang, bizId, idCardFrontTip, idCardBackTip, cancelButtonTitle);

        IWFaceDetectViewController *faceVC = [[IWFaceDetectViewController alloc] initOCRIdCardMode:IWFaceDetectForModeOCRIdCard
         authUrl:authUrl
         ocrUrl:ocrUrl 
         appKey:appKey
         appSecret:appSecret 
         bodyAppKey:bodyAppKey
         bodyAppSecret:bodyAppSecret 
         lang:lang 
         bizId:bizId
         idCardFrontTip:idCardFrontTip
         idCardBackTip:idCardBackTip
         cancelButtonTitle:cancelButtonTitle];


        faceVC.handler = ^(NSDictionary *_Nonnull userInfo, NSError *_Nonnull error) {
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfo options:NSJSONWritingPrettyPrinted error:&error];

            if (!jsonData) {
                callback(@[error]);
            } else {
                NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

                if (!resultString) {
                    NSLog(@"NSString initWithData:encoding: failed!");
                    callback(@[@"NSString Conversion failed"]);
                    return;
                }

                if (callback) {
                    NSLog(@"Callback is valid, proceeding to invoke callback");
                    callback(@[[NSNull null], resultString]);
                } else {
                    NSLog(@"Callback is NULL !!!");
                }
            }
        };

        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        if (window.rootViewController) {
            [window.rootViewController presentViewController:faceVC animated:YES completion:nil];
        } else {
            callback(@[@"Root view controller is nil"]);
        }
        //UIWindow *window = [UIApplication sharedApplication].keyWindow;
        //[window.rootViewController presentViewController:faceVC animated:YES completion:nil];
    });
}
RCT_EXPORT_METHOD(faceScan:(NSDictionary *)param callback:(RCTResponseSenderBlock)callback) {

    NSURL *baseUrl = [NSURL URLWithString:AIBaseUrl];
    NSString *appKey = AIAppKey;
    NSString *appSecret = AIAppSecret;
    dispatch_async(dispatch_get_main_queue(), ^{
          IWFaceDetectViewController *faceController = [[IWFaceDetectViewController alloc]
           initWithMode:IWFaceDetectForModeFaceLiveing
           baseURL:baseUrl
           appKey:appKey
           appSecret:appSecret
           baseImage:nil
           cameraFacingOn:CameraFacingFront
           imgQuality:0.2
           threshold:0.9];

        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        if (window.rootViewController) {
            [window.rootViewController presentViewController:faceController animated:YES completion:nil];
        } else {
            callback(@[@"Root view controller is nil"]);
        }
    }); 
}
RCT_EXPORT_METHOD(openPassportScan:(NSDictionary *)param callback:(RCTResponseSenderBlock)callback) {
    dispatch_async(dispatch_get_main_queue(), ^{
       
        NSURL *authUrl = [NSURL URLWithString:AIAuthUrl];
        NSURL *ocrUrl = [NSURL URLWithString:AIRecognizeUrl];
        NSString *appKey = AIAppKey;
        NSString *appSecret = AIAppSecret;
        NSString *bodyAppKey = AIBodyAppKey;
        NSString *bodyAppSecret = AIBodyAppSecret;
        NSString *lang = @"en";
        NSString *bizId = @"";
        NSString *passportTip = @"";
        NSString *cancelButtonTitle = @"";

        IWFaceDetectViewController *faceController = [[IWFaceDetectViewController alloc] 
            initOCRPassportMode:IWFaceDetectForModeOCRPassPort
            authUrl:authUrl
            ocrUrl:ocrUrl
            appKey:appKey
            appSecret:appSecret
            bodyAppKey:bodyAppKey
            bodyAppSecret:bodyAppSecret
            lang:lang
            bizId:bizId
            passportTip:passportTip
            cancelButtonTitle:cancelButtonTitle];

        //faceController.useMouthOpenDetector = YES;
        //faceController.useBlinkDetector = YES;
        //faceController.useEyeStateDetector = YES;
        __weak __typeof(self) weakSelf = self;
        faceController.handler = ^(NSDictionary *_Nonnull userInfo, NSError *_Nonnull error) {
            __strong __typeof(weakSelf) strongSelf = weakSelf;
            if (!strongSelf) return;

            if (error) {
                callback(@[error]);
                return;
            }

            // Store transaction ID
            id transactionIdValue = userInfo[@"transactionId"];
            if ([transactionIdValue isKindOfClass:[NSString class]]) {
                strongSelf.transactionId = transactionIdValue;
            } else if ([transactionIdValue isKindOfClass:[NSNumber class]]) {
                strongSelf.transactionId = [transactionIdValue stringValue];
            }

            NSError *jsonError = nil;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfo 
                options:NSJSONWritingPrettyPrinted 
                error:&jsonError];

            if (!jsonData || jsonError) {
                callback(@[jsonError ?: @"JSON serialization failed"]);
                return;
            }

            NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            if (!resultString) {
                callback(@[@"String conversion failed"]);
                return;
            }

            // Chain to compose view after delay
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [strongSelf openOCRComposeViewWithCompletion:^(NSString *_Nullable composeResult, NSError *_Nullable composeError) {
                    if (composeError) {
                        callback(@[composeError]);
                    } else if (composeResult) {
                        callback(@[[NSNull null], composeResult]);
                    }
                }];
            });
        };

        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        if (window.rootViewController) {
            [window.rootViewController presentViewController:faceController animated:YES completion:nil];
        } else {
            callback(@[@"Root view controller is nil"]);
        }
    });
}

RCT_EXPORT_METHOD(openComposeViewScan:(NSDictionary *)param callback:(RCTResponseSenderBlock)callback) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self openOCRComposeViewWithCompletion:^(NSString *_Nullable resultString, NSError *_Nullable error) {
            if (error) {
                callback(@[error]);
            } else if (resultString) {
                callback(@[[NSNull null], resultString]);
            }
        }];
    });
}

- (void)openOCRComposeViewWithCompletion:(void (^)(NSString *_Nullable resultString, NSError *_Nullable error))completion {
    NSURL *authUrl = [NSURL URLWithString:AIAuthUrl];
    NSURL *ocrUrl = [NSURL URLWithString:AICompareUrl];
    NSString *appKey = AIAppKey;
    NSString *appSecret = AIAppSecret;
    NSString *bodyAppKey = AIBodyAppKey;
    NSString *bodyAppSecret = AIBodyAppSecret;
    NSString *transactionId = self.transactionId ?: @"transactionId";
    NSString *bizId = @"";

    IWFaceDetectViewController *viewController = [[IWFaceDetectViewController alloc] 
        initOCRCompareMode:IWFaceDetectForModeOCRCompare 
        authUrl:authUrl 
        ocrUrl:ocrUrl 
        appKey:appKey 
        appSecret:appSecret 
        bodyAppKey:bodyAppKey 
        bodyAppSecret:bodyAppSecret 
        transactionId:transactionId 
        bizId:bizId];

    //viewController.useMouthOpenDetector = YES;
    //viewController.useBlinkDetector = YES;
    //viewController.useEyeStateDetector = YES;

    __weak __typeof(self) weakSelf = self;
    viewController.handler = ^(NSDictionary *_Nonnull userInfo, NSError *_Nonnull error) {
        if (error) {
            completion(nil, error);
            return;
        }

        // Update transaction ID
        weakSelf.transactionId = userInfo[@"transactionId"];

        NSError *jsonError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfo 
            options:NSJSONWritingPrettyPrinted 
            error:&jsonError];

        if (!jsonData || jsonError) {
            completion(nil, jsonError);
            return;
        }

        NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        completion(resultString, nil);
    };

    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    if (window.rootViewController) {
        [window.rootViewController presentViewController:viewController animated:YES completion:nil];
    } else {
        completion(nil, [NSError errorWithDomain:@"FaceModule" code:1 userInfo:@{NSLocalizedDescriptionKey: @"Root view controller is nil"}]);
    }
}


RCT_EXPORT_METHOD(doSomething:(NSString *)param callback:(RCTResponseSenderBlock)callback) {
    callback(@[[NSNull null], @"Success"]);
}

@end
