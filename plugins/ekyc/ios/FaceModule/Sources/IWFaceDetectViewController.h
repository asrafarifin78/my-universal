//
//  IWFaceDetectViewController.h
//  IWFaceDetector
//
//  Created by zhuangjl on 2020/9/22.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

UIKIT_EXTERN NSString * const IWFaceDetectUserInfoImageKey;
UIKIT_EXTERN NSString * const IWFaceDetectUserInfoModeKey;

typedef void(^IWFaceDetectHandler) (NSDictionary *userInfo, NSError *error);

typedef NS_ENUM(NSInteger, IWActionType) {
    IWActionTypeInvalid = -1,  // 添加无效状态
    IWActionTypeBlink = 0,
    IWActionTypeMouthOpen,
    IWActionTypeHeadShake,
    IWActionTypeHeadNod,
    IWActionTypeEyeState
};

typedef NS_ENUM(NSInteger, IWFaceDetectForMode) {
    IWFaceDetectForModeFaceThan,
    IWFaceDetectForModeFaceLiveing,
    IWFaceDetectForModeOCRIdCard,
    IWFaceDetectForModeOCRPassPort,
    IWFaceDetectForModeOCRCompare
};

typedef NS_ENUM(NSInteger, CameraFacingOn) {
    //前摄像头
    CameraFacingFront,
    //后摄像头
    CameraFacingOnBack
};

@interface IWFaceDetectViewController : UIViewController

/**
 * 回调block
 *@userInfo 回调信息
 * *** userInfo - code: 0，成功 -1失败；mode：IWFaceDetectForMode， message：消息说明，image:识别的图片；similarity：人脸比对相似度，范围0.0-1.0的浮点数，相似度越高人脸越相似；distance：人脸比对距离 范围0.0-2.0的浮点数，距离越小表示人脸越相似，一般只需关注相似度即可
 *@error 回调错误，成功为nil
 */
@property (nonatomic, copy) IWFaceDetectHandler handler;


@property (nonatomic, assign) BOOL useEyeStateDetector;
@property (nonatomic, assign) BOOL useBlinkDetector;
@property (nonatomic, assign) BOOL useMouthOpenDetector;
@property (nonatomic, assign) BOOL useHeadShakeDetector;
@property (nonatomic, assign) BOOL useHeadNodDetector;

// 新增属性
@property (nonatomic, strong) NSArray<NSNumber *> *actionSequence; // 存储动作序列
@property (nonatomic, assign) NSInteger currentActionIndex;
@property (nonatomic, assign) NSTimeInterval actionTimeout; // 动作检测超时时间
@property (nonatomic, copy) void (^actionTimeoutHandler)(IWActionType actionType); // 超时回调
/* default timeout for requests.  This will cause a timeout if no data is transmitted for the given timeout value, and is reset whenever data is transmitted. */
@property NSTimeInterval timeoutIntervalForRequest;

/* default timeout for requests.  This will cause a timeout if a resource is not able to be retrieved within a given timeout. */
@property NSTimeInterval timeoutIntervalForResource;

/**
 * 初始化方法
 * @mode
 * @url 北斗申请的url
 * @appkey 北斗申请的key
 * @appSecret 北斗申请的 appSecret
 * @baseImage 对比的证件照图片,mode == IWFaceDetectForModeFaceThan时，baseImage不能为nil。
 * @cameraFacingOn 前后摄像头
 */
- (instancetype)initWithMode:(IWFaceDetectForMode)mode
                     baseURL:(NSURL *)url
                      appKey:(NSString *)appKey
                   appSecret:(NSString *)appSecret
                   baseImage:(nullable UIImage *)baseImage
              cameraFacingOn:(CameraFacingOn)cameraFacingOn;
/**
 * 初始化方法
 * @mode
 * @url 北斗申请的url
 * @appkey 北斗申请的key
 * @appSecret 北斗申请的 appSecret
 * @baseImage 对比的证件照图片,mode == IWFaceDetectForModeFaceThan时，baseImage不能为nil。
 * @cameraFacingOn 前后摄像头
 * @imgQuality 图片压缩率 0.0~1.0
 * @threshold 人脸比对阈值0.0～1.0
 */
- (instancetype)initWithMode:(IWFaceDetectForMode)mode baseURL:(NSURL *)url appKey:(NSString *)appKey appSecret:(NSString *)appSecret baseImage:(UIImage *)baseImage cameraFacingOn:(CameraFacingOn)cameraFacingOn imgQuality:(CGFloat)imgQuality threshold:(CGFloat)threshold;

/**
 * 初始化方法
 * @mode
 * @url 北斗申请的url
 * @appkey 北斗申请的key
 * @appSecret 北斗申请的 appSecret
 * @aiKey 北斗ai申请的key
 * @aiSecret 北斗ai申请的 appSecret
 * @baseImage 对比的证件照图片,mode == IWFaceDetectForModeFaceThan时，baseImage不能为nil。
 * @cameraFacingOn 前后摄像头
 * @imgQuality 图片压缩率 0.0~1.0
 * @threshold 人脸比对阈值0.0～1.0
 */
- (instancetype)initWithMode:(IWFaceDetectForMode)mode
                     authUrl:(NSURL *)authUrl
              executeAlgoUrl:(NSURL *)executeAlgoUrl
                     algoUrl:(NSString *)algoUrl
                      appKey:(NSString *)appKey
                   appSecret:(NSString *)appSecret
                  bodyAppKey:(NSString *)bodyAppKey
               bodyAppSecret:(NSString *)bodyAppSecret
                   baseImage:(UIImage *)baseImage
              cameraFacingOn:(CameraFacingOn)cameraFacingOn
                  imgQuality:(CGFloat)imgQuality
                   threshold:(CGFloat)threshold
                     timeOut:(NSInteger)timeOut;

// OCR idcard
- (instancetype) initOCRIdCardMode:(IWFaceDetectForMode)mode
                           authUrl:(NSURL *)authUrl
                            ocrUrl:(NSURL *)ocrUrl
                            appKey:(NSString *)appKey
                         appSecret:(NSString *)appSecret
                        bodyAppKey:(NSString *)bodyAppKey
                     bodyAppSecret:(NSString *)bodyAppSecret
                              lang:(NSString *)lang
                             bizId:(NSString *)bizId
                    idCardFrontTip:(NSString *)idCardFrontTip
                     idCardBackTip:(NSString *)idCardBackTip
                 cancelButtonTitle:(NSString *)cancelButtonTitle;

// OCR 护照,
//bizId:(NSString *)bizId; // 业务ID // docType 001 身份证  002 护照
// recognizeURL: // java 服务日志记录
-(instancetype) initOCRPassportMode:(IWFaceDetectForMode)mode
                            authUrl:(NSURL *)authUrl
                             ocrUrl:(NSURL *)ocrUrl
                             appKey:(NSString *)appKey
                          appSecret:(NSString *)appSecret
                         bodyAppKey:(NSString *)bodyAppKey
                      bodyAppSecret:(NSString *)bodyAppSecret
                               lang:(NSString *)lang
                              bizId:(NSString *)bizId
                        passportTip:(NSString *)passportTip
                  cancelButtonTitle:(NSString *)cancelButtonTitle;


// IWFaceDetectForModeOCRCompare 人证比对
-(instancetype) initOCRCompareMode:(IWFaceDetectForMode)mode
                           authUrl:(NSURL *)authUrl
                            ocrUrl:(NSURL *)ocrUrl
                            appKey:(NSString *)appKey
                         appSecret:(NSString *)appSecret
                        bodyAppKey:(NSString *)bodyAppKey
                     bodyAppSecret:(NSString *)bodyAppSecret
                     transactionId:(NSString *)transactionId
                             bizId:(NSString *)bizId;
@end


NS_ASSUME_NONNULL_END

