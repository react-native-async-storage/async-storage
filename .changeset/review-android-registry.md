---
"@react-native-async-storage/async-storage": patch
---

Reuse getStorage's computeIfAbsent path when constructing RNStorage to prevent redundant native storage creation.

