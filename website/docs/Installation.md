---
id: install
title: Installation
sidebar_label: Installation
---



### Get library

With npm:
```bash
npm install @react-native-async-storage/async-storage
```

With Yarn:
```bash
yarn add @react-native-async-storage/async-storage
```

### Link

#### Android & iOS

- **React Native 0.60+**

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app.

On iOS, use CocoaPods to add the native `RNAsyncStorage` to your project:

```bash
npx pod-install
```

- **React Native <= 0.59**


```bash
react-native link @react-native-async-storage/async-storage
```

#### Windows

- **React Native Windows >= 0.63**
[CLI autolink feature](https://microsoft.github.io/react-native-windows/docs/native-modules-autolinking) links the module while building the app.

- **React Native Windows <= 0.62**
For earlier versions check [manual linking](Linking.md)

#### macOS
For `macOS` the [manual linking](Linking.md) is currently the only linking option.
