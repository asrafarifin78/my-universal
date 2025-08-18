// biome-ignore assist/source/organizeImports: <explanation>
const {
  withDangerousMod,
  withMainApplication,
  withAppBuildGradle,
  withAndroidManifest,
  withXcodeProject,
} = require('@expo/config-plugins');
const { de } = require('date-fns/locale');
const fs = require('fs');
const path = require('path');
const devLog = (...args) => console.log(...args); // Adjust path as needed

const BRIDGING_HEADER_PATH = 'UniverseApp/UniverseApp-Bridging-Header.h';
const FACE_MODULE_IMPORT = `#import "FaceModule.h"`;

// iOS 1️⃣ Patch Podfile
function withFaceModuleIOS(config) {
   
      
    return withDangerousMod(config, ['ios', async (config) => {
      
        devLog("withFaceModuleIOS called ");  
        const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
        if (!fs.existsSync(podfilePath)) return config;

        let content = fs.readFileSync(podfilePath, 'utf8');
        const podLine = `  pod 'FaceDetectionSDK', :path => '../plugins/ekyc/ios/FaceModule'\n`;

        if (!content.includes("FaceDetectionSDK")) {
          const insertPoint = content.indexOf('config = use_native_modules!(config_command)');
          if (insertPoint !== -1) {
            const newlineIndex = content.indexOf('\n', insertPoint) + 1;
            content = `${content.slice(0, newlineIndex)}\n  # Face Detection Module\n${podLine}${content.slice(newlineIndex)}`;
            fs.writeFileSync(podfilePath, content);
            devLog('✅ Patched Podfile with FaceDetectionSDK');
          }
        }
      
      return config;
    }]);
}


// iOS 2️⃣ Create/Append Bridging Header
function withBridgingHeader(config) {
  
    return withDangerousMod(config, ['ios', async (config) => {
      
      devLog("withBridgingHeader called ");
        const headerPath = path.join(config.modRequest.platformProjectRoot, BRIDGING_HEADER_PATH);
        const headerDir = path.dirname(headerPath);
        if (!fs.existsSync(headerDir)) fs.mkdirSync(headerDir, { recursive: true });

        const headerExists = fs.existsSync(headerPath);
        const content = headerExists ? fs.readFileSync(headerPath, 'utf8') : '';

        if (!content.includes(FACE_MODULE_IMPORT)) {
          const newContent = content.trim() + `\n${FACE_MODULE_IMPORT}\n`;
          fs.writeFileSync(headerPath, newContent, 'utf8');
          devLog('✅ Updated Bridging Header');
        } else {
          devLog('ℹ️ Bridging Header already contains FaceDetectionModule.h');
        }
      
        return config;
    }]);
  
}

// iOS 3️⃣ Set bridging header in Xcode project
function withBridgingBuildSetting(config) {
  
    return withXcodeProject(config, async (config) => {
      
        devLog("withBridgingBuildSetting called ");
        const project = config.modResults;

        for (const [_, section] of Object.entries(project.buildSettings ?? {})) {
          if (
            section &&
            typeof section === 'object' &&
            section['PRODUCT_NAME'] &&
            !section['SWIFT_OBJC_BRIDGING_HEADER']
          ) {
            section['SWIFT_OBJC_BRIDGING_HEADER'] = BRIDGING_HEADER_PATH;
            devLog(`✅ Set SWIFT_OBJC_BRIDGING_HEADER = ${BRIDGING_HEADER_PATH}`);
          }
        }
      
      return config;
    });
  
}

// iOS 4️⃣ Add static library to Xcode project
function withStaticLibrary(config) {
  
    return withXcodeProject(config, async (config) => {
      
        devLog("withStaticLibrary called ");
        const project = config.modResults;
        const libPath = '../plugins/ekyc/ios/FaceModule/libIWFaceDetector.a';
        
        project.addStaticLibrary(libPath, {
          target: project.getFirstTarget().uuid
        });

        devLog('✅ Added libIWFaceDetector.a to Xcode project');
      
        return config;
    });
  
}

// iOS 5️⃣ Add frameworks to Xcode project
function withFrameworks(config) {

    return withXcodeProject(config, async (config) => {
      
      devLog("withFrameworks called ");
        const project = config.modResults;
        const vendorsPath = path.join(config.modRequest.projectRoot, 'plugins/ekyc/ios/FaceModule/Vendors');
        
        if (fs.existsSync(vendorsPath)) {
          const frameworks = fs.readdirSync(vendorsPath).filter(file => file.endsWith('.framework'));
          
          frameworks.forEach(framework => {
            const frameworkPath = `../plugins/ekyc/ios/FaceModule/Vendors/${framework}`;
            project.addFramework(frameworkPath, {
              target: project.getFirstTarget().uuid,
              embed: true
            });
            devLog(`✅ Added ${framework} to Xcode project`);
          });
        }
            
        return config;
    });
  
}

function withCleanupXcodeSettings(config) {
  return withXcodeProject(config, async (config) => {
    devLog("withCleanupXcodeSettings called ");
    const project = config.modResults;

    // Only clean build files and references for targets, not entitlements
    const pbxBuildFile = project.pbxBuildFileSection();
    const pbxFileReference = project.pbxFileReferenceSection();

    for (const buildFileId in pbxBuildFile) {
      const buildFile = pbxBuildFile[buildFileId];
      if (buildFile?.fileRef) {
        const fileRef = pbxFileReference[buildFile.fileRef];
        // Skip entitlements
        if (fileRef?.path?.includes('libIWFaceDetector.a') && !fileRef?.path?.includes('entitlements')) {
          devLog('🧹 Removing pbxBuildFile reference:', buildFileId);
          delete pbxBuildFile[buildFileId];
        }
      }
    }

    for (const fileRefId in pbxFileReference) {
      const fileRef = pbxFileReference[fileRefId];
      // Skip entitlements
      if (fileRef?.path?.includes('libIWFaceDetector.a') && !fileRef?.path?.includes('entitlements')) {
        devLog('🧹 Removing pbxFileReference:', fileRefId);
        delete pbxFileReference[fileRefId];
      }
    }

    // Clean build configurations, but skip entitlements
    const configurations = project.pbxXCBuildConfigurationSection();
    for (const configId in configurations) {
      const configSection = configurations[configId];
      if (configSection?.buildSettings) {
        const buildSettings = configSection.buildSettings;
        // Only remove search paths and flags for targets, not entitlements
        if (!configSection.name?.includes('Entitlements')) {
          ['LIBRARY_SEARCH_PATHS', 'FRAMEWORK_SEARCH_PATHS', 'HEADER_SEARCH_PATHS'].forEach(key => {
            if (buildSettings[key]) {
              devLog(`🧹 Removed ${key} completely`);
              delete buildSettings[key];
            }
          });
          if (buildSettings['OTHER_LDFLAGS']) {
            let flags = Array.isArray(buildSettings['OTHER_LDFLAGS'])
              ? buildSettings['OTHER_LDFLAGS'].join(' ')
              : buildSettings['OTHER_LDFLAGS'];
            flags = flags
              .replace(/-lIWFaceDetector/g, '')
              .replace(/-lc\+\+/g, '')
              .replace(/plugins\/ekyc/g, '')
              .replace(/\s+/g, ' ')
              .trim();
            buildSettings['OTHER_LDFLAGS'] = flags || '$(inherited)';
          }
        }
      }
    }

    return config;
  });
}


// Android 1️⃣ Inject FaceSDKPackage
function withFaceSDKPackage(config) {
  return withMainApplication(config, (config) => {
    const contents = config.modResults.contents;
    if (!contents.includes('packages.add(FaceSDKPackage())')) {
      config.modResults.contents = contents.replace(
        /val packages = PackageList\(this\)\.packages/,
        'val packages = PackageList(this).packages\n      packages.add(FaceSDKPackage())'
      );
    }
    return config;
  });
}

// Android 2️⃣ Inject metadata into AndroidManifest.xml
function withFaceSDKAndroidManifest(config) {
  return withAndroidManifest(config, async (config) => {
    const mainApp = config.modResults.manifest.application[0];
    const meta = [
      { name: 'DIAppKey', value: '6f105a9d0c44bf43e4a9ec1d508c9a0b' },
      { name: 'DIAppSecret', value: 'b4a79b92f479f67eb0bdb4100fd8beda' },
      { name: 'BodyAppKey', value: '6f105a9d0c44bf43e4a9ec1d508c9a0b' },
      { name: 'BodyAppSecret', value: 'b4a79b92f479f67eb0bdb4100fd8beda' },
    ];

    mainApp['meta-data'] = mainApp['meta-data'] || [];
    meta.forEach(({ name, value }) => {
      const exists = mainApp['meta-data'].some((m) => m.$['android:name'] === name);
      if (!exists) {
        mainApp['meta-data'].push({ $: { 'android:name': name, 'android:value': value } });
      }
    });

    return config;
  });
}

// Android 3️⃣ Copy .aar/.jar to android/app/libs
function withCopyAARFiles(config) {
  return withDangerousMod(config, ['android', async (config) => {
    const src = path.join(config.modRequest.projectRoot, 'plugins/ekyc/android/libs');
    const dest = path.join(config.modRequest.platformProjectRoot, 'app/libs');

    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((file) => {
      if (file.endsWith('.aar') || file.endsWith('.jar')) {
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
      }
    });

    return config;
  }]);
}

// Android 4️⃣ Copy Java files to app/src/main/java
function withCopyJavaFiles(config) {
  return withDangerousMod(config, ['android', async (config) => {
    const src = path.join(config.modRequest.projectRoot, 'plugins/ekyc/android/java/com/myekyc/sdk');
    const dest = path.join(config.modRequest.platformProjectRoot, 'app/src/main/java/my/com/tm/uniapp');

    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((file) => {
      if (file.endsWith('.java')) {
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
      }
    });

    return config;
  }]);
}

// Android 5️⃣ Patch build.gradle for dependencies + dataBinding
function withUpdateBuildGradle(config) {
  return withAppBuildGradle(config, (config) => {
    let gradle = config.modResults.contents;

    if (!/buildFeatures\s*{[^}]*dataBinding\s*true/.test(gradle)) {
      gradle = gradle.replace(
        /android\s*{([^}]*)/,
        (match, inner) => `android {\n    buildFeatures {\n        dataBinding true\n    }\n${inner}`
      );
    }

    const libsLine = `implementation fileTree(dir: "libs", include: ["*.jar", "*.aar"])`;
    if (!gradle.includes(libsLine)) {
      gradle = gradle.replace(/dependencies\s*{/, `dependencies {\n    ${libsLine}`);
    }

    const deps = [
      `implementation 'androidx.appcompat:appcompat:1.1.0'`,
      `implementation 'androidx.constraintlayout:constraintlayout:1.1.3'`,
      `implementation 'com.android.support:multidex:1.0.0'`,
      `testImplementation 'junit:junit:4.13'`,
      `androidTestImplementation 'androidx.test.ext:junit:1.1.3'`,
      `androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'`,
      `implementation 'com.squareup.retrofit2:retrofit:2.3.0'`,
      `implementation 'com.squareup.retrofit2:converter-gson:2.3.0'`,
      `implementation 'com.squareup.okhttp3:logging-interceptor:3.4.1'`,
      `implementation 'com.squareup.retrofit2:adapter-rxjava:2.2.0'`,
      `implementation 'org.greenrobot:eventbus:3.1.1'`,
      `implementation "org.jetbrains.kotlin:kotlin-stdlib:1.6.20"`,
      `implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0'`,
      `implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.0'`,
      `implementation 'androidx.core:core-ktx:1.6.0'`,
    ];

    deps.forEach((dep) => {
      if (!gradle.includes(dep)) {
        gradle = gradle.replace(/dependencies\s*{/, (match) => `${match}\n    ${dep}`);
      }
    });

    config.modResults.contents = gradle;
    return config;
  });
}

// 🔚 Main Export
module.exports = function withFaceModule(config) {
   
      config = withFaceModuleIOS(config);
      config = withBridgingHeader(config);
      config = withBridgingBuildSetting(config);
      //config = withCleanupXcodeSettings(config);
      config = withStaticLibrary(config);    
      config = withFrameworks(config);       
      config = withFaceSDKPackage(config);
      config = withFaceSDKAndroidManifest(config);
      config = withCopyAARFiles(config);
      config = withCopyJavaFiles(config);
      config = withUpdateBuildGradle(config);
   
  return config;
}
