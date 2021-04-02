---
id: executor
title: Dedicator Thread Executor
sidebar_label: Dedicated Executor
---
import PlatformSupport from "../../src/components/Platform.js"

**Supported platforms:**
<PlatformSupport title="Android" platformIcon="icon_android.svg"></PlatformSupport>

---

**Note**: This feature is obsolete when [Next storage feature is enabled](Next.md).


## Motivation

This feature would be mostly used in brownfield apps and [in edge cases with some android devices.](https://github.com/react-native-async-storage/async-storage/issues/159)
Dedicated thread pool executor makes `AsyncStorage` use separate thread pool for its tasks execution.

Use this feature if `THREAD_POOL_EXECUTOR` from `AsyncTasks`:

- Is used in your app, so that background tasks are queued most of the time
- Acts weird on your device (for example, waits for some time before execution)

## How to use

Add a `AsyncStorage_dedicatedExecutor` property to your `android/gradle.properties`:

```
AsyncStorage_dedicatedExecutor=true
```
