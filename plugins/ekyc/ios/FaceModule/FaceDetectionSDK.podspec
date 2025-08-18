Pod::Spec.new do |spec|
  spec.name         = "FaceDetectionSDK"
  spec.version      = "1.0.0"
  spec.summary      = "Face Detection SDK with Seeta frameworks"
  spec.description  = "A comprehensive face detection SDK including multiple Seeta frameworks and OpenCV"
  spec.homepage     = "https://github.com/yourcompany/facedetectionsdk"
  spec.license      = { :type => "MIT" }
  spec.author       = { "Asraf Arifin" => "asraf@credence.tech" }

  spec.platform     = :ios, "13.0"
  spec.source       = { :path => "." }  # use :git for publishing
  spec.requires_arc = true
  spec.weak_framework   = 'CoreAudio'
  # Uncomment if Swift is used:
  # spec.swift_versions = ['5.0']

  #spec.module_name   = "FaceDetectionSDK"             # ✅ Added here
  #spec.static_framework = true                        # ✅ Recommended
  #spec.header_mappings_dir = "Sources"                # ✅ Optional but helps

  spec.source_files = "Sources/**/*.{h,m,mm,swift}"
  spec.public_header_files = "Sources/**/*.h"

  # Include .a and .frameworks
  spec.vendored_libraries = ["libIWFaceDetector.a","libjpeg.a"]
  spec.vendored_frameworks = Dir["Vendors/*.framework"]

  # Link required system libraries and frameworks
  spec.frameworks = [
    "UIKit", "Foundation", "AVFoundation", 
    "CoreMedia", "CoreVideo", "QuartzCore", "Accelerate"
  ]
  spec.libraries = "z", "c++"

  # Extra build settings
  #spec.pod_target_xcconfig = {
  #  'CLANG_CXX_LIBRARY' => 'libc++',
  #'OTHER_LDFLAGS' => '-ObjC -lIWFaceDetector -Wl,-weak_framework,CoreAudioTypes',
  # 'LIBRARY_SEARCH_PATHS' => '"${PODS_TARGET_SRCROOT}"',
  #'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64'
  #}
   # Fixed library search paths
  spec.pod_target_xcconfig = {
  'LIBRARY_SEARCH_PATHS' => '$(SRCROOT)/plugins/ekyc/ios/FaceModule',
  'CLANG_CXX_LANGUAGE_STANDARD' => 'gnu++17',
  'CLANG_CXX_LIBRARY' => 'libc++',
  'OTHER_LDFLAGS' => '-ObjC -lIWFaceDetector',
  'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64'
}


  spec.dependency "React-Core"
end
