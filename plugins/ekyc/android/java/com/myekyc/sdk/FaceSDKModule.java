package my.com.tm.uniapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.whaledi.facesdk.FaceActivity;
import com.whaledi.facesdk.CardActivity;

public class FaceSDKModule extends ReactContextBaseJavaModule {
    private static final String TAG = "FaceSDKModule";
    private static final int FACE_ACTIVITY_REQUEST_CODE = 1001;
    private static final int OCR_ACTIVITY_REQUEST_CODE = 1002;
    private static final int CONTEXT_READY_DELAY_MS = 500;

    private Promise mPromise;
    private final Handler mHandler = new Handler(Looper.getMainLooper());

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (mPromise == null) {
                Log.w(TAG, "Promise is null, ignoring activity result");
                return;
            }

            Log.d(TAG, "Activity result received - requestCode: " + requestCode + ", resultCode: " + resultCode);

            if (data == null) {
                Log.w(TAG, "Activity returned null data, likely cancelled or crashed");
                mPromise.reject("E_ACTIVITY_CANCELLED", "Activity was cancelled or returned no data.");
                mPromise = null;
                return;
            }

            if (requestCode == FACE_ACTIVITY_REQUEST_CODE || requestCode == OCR_ACTIVITY_REQUEST_CODE) {
                mHandler.postDelayed(() -> {
                    try {
                        WritableMap result = Arguments.createMap();
                        result.putString("code", data.getStringExtra("code"));
                        result.putString("message", data.getStringExtra("message"));
                        result.putString("transactionId", data.getStringExtra("transactionId"));
                        result.putString("bizId", data.getStringExtra("bizId"));
                        result.putString("idNumber", data.getStringExtra("idNumer")); // NOTE: `idNumer` might be a typo in your SDK
                        result.putString("name", data.getStringExtra("name"));
                        result.putString("filepath", data.getStringExtra("output.filepath"));

                        Log.d(TAG, "Activity Result for request " + requestCode + ": " + result.toString());
                        mPromise.resolve(result);
                    } catch (Exception e) {
                        Log.e(TAG, "Error processing activity result", e);
                        mPromise.reject("E_RESULT_PROCESSING_ERROR", "Error processing activity result: " + e.getMessage());
                    } finally {
                        mPromise = null;
                    }
                }, CONTEXT_READY_DELAY_MS);
            }
        }
    };

    public FaceSDKModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "FaceSDKModule";
    }

    @ReactMethod
    public void launchFaceActivity(ReadableMap options, Promise promise) {
        mPromise = promise;
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_ERROR", "Activity doesn't exist");
            return;
        }

        try {
            Intent intent = new Intent(currentActivity, FaceActivity.class);

            if (options.hasKey("authUrl")) intent.putExtra("authUrl", options.getString("authUrl"));
            if (options.hasKey("compareUrl")) intent.putExtra("compareUrl", options.getString("compareUrl"));
            if (options.hasKey("baseUrl")) intent.putExtra("baseUrl", options.getString("baseUrl"));
            if (options.hasKey("mode")) intent.putExtra("mode", options.getInt("mode"));
            if (options.hasKey("checkItem")) intent.putExtra("checkItem", options.getInt("checkItem"));
            if (options.hasKey("camerFacingOn")) intent.putExtra("camerFacingOn", options.getInt("camerFacingOn"));
            if (options.hasKey("camerFacingDefault")) intent.putExtra("camerFacingDefault", options.getInt("camerFacingDefault"));
            if (options.hasKey("imgQuality")) intent.putExtra("imgQuality", options.getInt("imgQuality"));
            if (options.hasKey("imgMaxSize")) intent.putExtra("imgMaxSize", options.getInt("imgMaxSize"));
            if (options.hasKey("debug")) intent.putExtra("debug", options.getBoolean("debug"));
            if (options.hasKey("lang")) intent.putExtra("lang", options.getString("lang"));
            if (options.hasKey("threshold")) intent.putExtra("threshold", options.getDouble("threshold"));

            String bizId = options.hasKey("bizId") ? options.getString("bizId") : "00xxaaarrr11";
            intent.putExtra("BIZ_ID", bizId);
            if (options.hasKey("transactionId")) intent.putExtra("transactionId", options.getString("transactionId"));

            // Auth params
            intent.putExtra("appKey", "d1134c336fbd86206476be4ca5df69d1");
            intent.putExtra("appSecret", "b0fb3a55aa7c8d3a5c12c5f42de5b2dc");
            intent.putExtra("bodyAppKey", "d1134c336fbd86206476be4ca5df69d1");
            intent.putExtra("bodyAppSecret", "b0fb3a55aa7c8d3a5c12c5f42de5b2dc");

            currentActivity.startActivityForResult(intent, FACE_ACTIVITY_REQUEST_CODE);
        } catch (Exception e) {
            Log.e(TAG, "Error launching FaceActivity", e);
            promise.reject("E_LAUNCH_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void launchOcrActivity(ReadableMap options, Promise promise) {
        mPromise = promise;
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_ERROR", "Activity doesn't exist");
            return;
        }

        mHandler.postDelayed(() -> {
            try {
                Intent intent = new Intent(currentActivity, CardActivity.class);

                if (!options.hasKey("ocrUrl") || options.getString("ocrUrl") == null) {
                    promise.reject("E_MISSING_PARAMETER", "ocrUrl is required");
                    return;
                }

                if (!options.hasKey("authUrl") || options.getString("authUrl") == null) {
                    promise.reject("E_MISSING_PARAMETER", "authUrl is required");
                    return;
                }

                intent.putExtra("imgMaxSize", 300);
                intent.putExtra("lang", options.hasKey("lang") ? options.getString("lang") : "en");
                intent.putExtra("docType", options.hasKey("docType") ? options.getString("docType") : "001");
                intent.putExtra("mImgQuality", 100);
                intent.putExtra("ocrUrl", options.getString("ocrUrl"));
                intent.putExtra("authUrl", options.getString("authUrl"));
                intent.putExtra("idFrontTip", options.hasKey("idFrontTip") ? options.getString("idFrontTip") : "");
                intent.putExtra("idBackTip", options.hasKey("idBackTip") ? options.getString("idBackTip") : "mobile");

                Log.d(TAG, "Launching OCR activity with parameters: " + intent.toString());

                currentActivity.startActivityForResult(intent, OCR_ACTIVITY_REQUEST_CODE);
            } catch (Exception e) {
                Log.e(TAG, "Error launching CardActivity", e);
                promise.reject("E_LAUNCH_OCR_ERROR", e.getMessage());
            }
        }, 1000);
    }
}
