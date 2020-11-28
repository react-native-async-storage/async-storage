---
id: install
title: Installation
sidebar_label: Installation
---



### Get library

```bash
yarn add @react-native-community/async-storage
```

### Link

- **React Native 0.60+**

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app. 

Use CocoaPods to add the native `RNAsyncStorage` to your project:

```bash
npx pod-install
```

- **React Native <= 0.59**


```bash
react-native link @react-native-community/async-storage
```

*Note:* For `Windows` the [manual linking](Linking.md) is currently the only linking option.
