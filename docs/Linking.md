# Manual Linking

## iOS
1. Open your project `.xcodeproj`

2. Add `RNCAsyncStorage.xcodeproj` to your project Libraries (right click on libraries folder and select `Add files to "yourProject"`)

3. Go to your projects Build Phases -> Link Binary with Libraries and add: `libRNCAsyncStorage.a`

4. Add this line to your Podfile (if you haven't one simply run `cd ios/ && pod init` on your project's root folder), just below the last pod:

```
pod 'react-native-async-storage', :path => '../node_modules/@react-native-community/async-storage'
```

after that run `pod install`

## Android
1. Add project to `android/settings.gradle`:
```diff
rootProject.name = 'MyApp'

include ':app'

+ include ':@react-native-community_async-storage'
+ project(':@react-native-community_async-storage').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-community/async-storage/android')
  ```

2. In `android/app/build.gradle` add to dependencies:
```diff
dependencies {
  ...
+ implementation project(':@react-native-community_async-storage')
}
  ```

3. Then, in `MainApplication.java`:
```diff
package com.myapp;

+ import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

...

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
+       new AsyncStoragePackage()
    );
}
```
