require 'json'

package = JSON.parse(File.read(File.join('..', '..', 'package.json')))

Pod::Spec.new do |s|
  s.name      = 'AsyncStorageExample-UITests'
  s.version   = '0.0.1-dev'
  s.author    = { package['author']['name'] => package['author']['email'] }
  s.license   = package['license']
  s.homepage  = package['homepage']
  s.source    = { git: package['repository']['url'] }
  s.summary   = 'AsyncStorageExample UI tests'

  s.ios.deployment_target = '12.0'
  s.osx.deployment_target = '10.14'

  s.dependency 'React'
  s.dependency 'ReactTestApp-DevSupport'

  s.framework             = 'XCTest'
  s.user_target_xcconfig  = { 'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES' => '$(inherited)' }

  s.source_files = 'AsyncStorageExample-macOSUITests/**/*.{m,swift}'
end
