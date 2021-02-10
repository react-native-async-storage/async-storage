---
id: link
title: Manual linking
sidebar_label: Manual linking
---


## iOS

#### Project linking
1. Open your project `.xcodeproj` on xcode.

2. Right click on the Libraries folder and select `Add files to "yourProjectName"`.

3. Add `RNCAsyncStorage.xcodeproj` (located at `node_modules/@react-native-async-storage/async-storage/ios`) to your project Libraries.

3. Go to `Build Phases -> Link Binary with Libraries` and add:  `libRNCAsyncStorage.a`.

#### Using 'Pods'
1. Enter into iOS Folder `cd ios/` (on your project's root folder).

2. Add this line to your `Podfile` just below the last pod (if you don't have one, you can create it by running `pod init`):

```diff
+ pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-async-storage/async-storage'
```

3. Run `pod install`

## macOS

#### Project linking
1. Open your project `.xcodeproj` on xcode.

2. Right click on the Libraries folder and select `Add files to "yourProjectName"`.

3. Add `RNCAsyncStorage.xcodeproj` (located at `node_modules/@react-native-async-storage/async-storage/macos`) to your project Libraries.

4. Go to `Build Phases -> Link Binary with Libraries` and add: `libRNCAsyncStorage-macOS.a`.


## Android
1. Add project to `android/settings.gradle`:
```diff
rootProject.name = 'MyApp'

include ':app'

+ include ':@react-native-async-storage'
+ project(':@react-native-async-storage').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-async-storage/async-storage/android')
  ```

2. In `android/app/build.gradle` add to dependencies:
```diff
dependencies {
  ...
+ implementation project(':@react-native-async-storage')
}
  ```

3. Then, in `android/app/src/main/java/your/package/MainApplication.java`:
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


## Windows


#### Add `ReactNativeAsyncStorage` project to your solution.


1. Open your solution in Visual Studio.

2. Right click Solution icon in Solution Explorer > Add > Existing Project.
   Select `node_modules\@react-native-async-storage\async-storage\windows\ReactNativeAsyncStorage\ReactNativeAsyncStorage.vcxproj` (on RNW 0.61, select `node_modules\@react-native-async-storage\async-storage\windows\ReactNativeAsyncStorage61\ReactNativeAsyncStorage61.vcxproj`)


#### Add a reference to `ReactNativeAsyncStorage` in your main application project.


1. Right click main application project > Add > Reference...
  Check `ReactNativeAsyncStorage` from Solution Projects.
2. Add `#include "winrt/ReactNativeAsyncStorage.h"` to `pch.h`.
3. Add `PackageProviders().Append(winrt::ReactNativeAsyncStorage::ReactPackageProvider());` before `InitializeComponent();` in `app.cpp`.
