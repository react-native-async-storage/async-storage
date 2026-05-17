---
"@react-native-async-storage/async-storage": patch
---

- Correctly handle "other" error for Apple platforms
- Android to use limited parallelism from DispatcherIO, instead of using dedicated thread pools per database
- When providing null for a key, for some reason, throw an error instead of crashing the app
- Make example RN example work again
- Use concurrent hashmap instead of hashmap + synchronization combo for Storage initialization on Android
- Double check lock for legacy storage initialization on android
