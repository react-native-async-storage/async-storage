require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "AsyncStorage"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  # Follow React Native's minimum iOS version when it is available (RN >= 0.69). React
  # Native's post_install raises the deployment target of pod targets but not of resource
  # bundle targets, so the privacy bundle would otherwise keep a deployment target that
  # newer Xcode versions reject (see issue #1355).
  ios_deployment_target = defined?(min_ios_version_supported) ? min_ios_version_supported : "13.0"
  s.platforms    = { :ios => ios_deployment_target, :osx => "12.0", :visionos => "1.0" }
  s.source       = { :git => "https://github.com/react-native-async-storage/async-storage.git", :tag => "#{s.version}" }
  s.resource_bundles = { "AsyncStorage_resources" => "apple/PrivacyInfo.xcprivacy" }

  s.source_files = "apple/**/*.{h,m,mm,cpp,swift}"
  s.swift_version = "5.9.2"

  s.ios.vendored_frameworks = "apple-frameworks/SharedAsyncStorage.xcframework"
  s.osx.vendored_frameworks = "apple-frameworks/SharedAsyncStorage.xcframework"


  install_modules_dependencies(s)
end
