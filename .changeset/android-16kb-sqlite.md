---
"@react-native-async-storage/async-storage": patch
---

Stop packaging the unused bundled SQLite JNI library into Android apps. That library triggered the 16 KB page-size Play Console warning.
