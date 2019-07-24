# Dedicated Thread Executor

Android only feature.
Would be mostly used in brownfield apps and [in edge cases with some android devices.](https://github.com/react-native-community/async-storage/issues/159)

## Motivation

Dedicated thread pool executor makes `AsyncStorage` use separate thread pool for its tasks execution.

Use this feature if `THREAD_POOL_EXECUTOR` from `AsyncTasks`:

- Is used in your app, so that background tasks are queued most of the time
- Acts weird on your device (for example, waits for some time before execution)

## How to use

Add a `AsyncStorage_dedicatedExecutor` property to your `android/gradle.properties`:

```
AsyncStorage_dedicatedExecutor=true
```

