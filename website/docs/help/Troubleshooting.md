---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

## [iOS] CocoaPods issues

1. Delete the `node_modules` folder(s) from your project
2. Run `yarn` or `npm install`
3. If you're using CocoaPods:
   1. Make sure your `Podfile` does _not_ have an entry for `RNCAsyncStorage`.
   2. `pod install`
   3. `pod update RNCAsyncStorage`
4. Open your Xcode project
5. Press ⇧⌥⌘K to clean your build folder
6. Build and run your project

> Note that every time `@react-native-async-storage/async-storage` gets updated,
> you must also run `pod update RNCAsyncStorage` otherwise you'll still be using
> the previous version.

## [iOS] fatal error: 'React/RCTBridgeModule.h' file not found

```
info In file included from /~/@react-native-async-storage/async-storage/ios/RNCAsyncStorage.m:8:
/~/@react-native-async-storage/async-storage/ios/RNCAsyncStorage.h:8:9: fatal error: 'React/RCTBridgeModule.h' file not found

info #import <React/RCTBridgeModule.h>
             ^~~~~~~~~~~~~~~~~~~~~~~~~

info 1 error generated.
```

- Make sure that you've run `pod install` or `pod update RNCAsyncStorage` (see
  also [CocoaPods issues](#ios-cocoapods-issues)).

- Make sure that `React` dependencies are _not_ removed from projects. Without
  the target dependency set, Xcode may build things out of order and the React
  headers will not be installed when AsyncStorage is built.

  ```Podfile
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      if target.name == "React"
        target.remove_from_project
      end
    end
  end
  ```

- Try switching back to the legacy build system in Xcode. You can find it in
  File > Project/Workspace Settings sheet.

## [@RNC/AsyncStorage]: NativeModule: AsyncStorage is null

#### iOS

This error means that AsyncStorage was unable to find its native module. This
occurs because AsyncStorage was not linked into the final app bundle.

Make sure that you've run `pod install` or `pod update RNCAsyncStorage` (see
also [CocoaPods issues](#ios-cocoapods-issues)).
