---
"@react-native-async-storage/async-storage": patch
---

Follow React Native's minimum iOS version in the podspec when it is defined, so resource bundle targets no longer keep a deployment target that newer Xcode versions reject (fixes the Xcode 27 build error reported in #1355).
