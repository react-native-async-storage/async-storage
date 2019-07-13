require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNCAsyncStorage"
  s.version      = "2.0.0"
  s.summary      = "Legacy module for React Native Async Storage"
  s.license      = "MIT"

  s.authors      = "React Native Community"
  s.homepage     = "https://github.com/react-native-community"
  s.platform     = :ios, "9.0"

  s.source       = { :git => "https://github.com/react-native-community/react-native-async-storage.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m}"

  s.dependency 'React'
end
