# @react-native-async-storage/async-storage Windows Implementation

## Module Installation
You can either use autolinking on react-native-windows 0.63 and later or manually link the module on earlier releases.

### Automatic install with autolinking on RNW >= 0.63
@react-native-async-storage/async-storage supports autolinking. Just call: `yarn add @react-native-async-storage/async-storage`

### Manual installation on RNW >= 0.62
1. `yarn add @react-native-async-storage/async-storage`
2. Open your solution in Visual Studio 2019 (eg. `windows\yourapp.sln`)
3. Right-click Solution icon in Solution Explorer > Add > Existing Project...
4. Add `node_modules\@react-native-async-storage\async-storage\windows\ReactNativeAsyncStorage\ReactNativeAsyncStorage.vcxproj`
5. Right click main application project > Add > Reference...
6. Select `ReactNativeAsyncStorage` in Solution Projects
7. Add `#include "winrt/ReactNativeAsyncStorage.h"` to `pch.h`.
8. Add `PackageProviders().Append(winrt::ReactNativeAsyncStorage::ReactPackageProvider());` before `InitializeComponent();` in `app.cpp`.

### Manual installation on RNW 0.61
Do the same steps as for 0.62, but use `node_modules\@react-native-async-storage\async-storage\windows\ReactNativeAsyncStorage61\ReactNativeAsyncStorage.vcxproj` in step 4.

## Module development

If you want to contribute to this module Windows implementation, first you must install the [Windows Development Dependencies](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies).

You must temporary install `react-native-windows` package. Versions of `react-native-windows` and `react-native` must match. E.g. if the moudule uses `react-native@0.62`, install `npm i react-native-windows@^0.62 --dev`.

Now, you will be able to open corresponding `ReactNativeAsyncStorage...sln` file, e.g. `ReactNativeAsyncStorage62.sln` for `react-native-windows@0.62`.