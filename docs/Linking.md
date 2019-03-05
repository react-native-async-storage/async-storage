# Manual Linking
-

## iOS
-

## Android
1. Edit `android/settings.gradle` to look like this (without the +):
```diff
rootProject.name = 'MyApp'

include ':app'

+ include ':@react-native-community_async-storage'
+ project(':@react-native-community_async-storage').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-community/async-storage/android')
  ```

2. And in `android/app/build.gradle` add this to dependencies:
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
