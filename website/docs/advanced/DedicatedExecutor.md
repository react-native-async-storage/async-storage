---
id: executor
title: Dedicator Thread Executor
sidebar_label: Dedicated Executor
---

**Supported platforms:**
<PlatformSupport title="Android" platformIcon="icon_android.svg"></PlatformSupport>

---

This feature would be mostly used in brownfield apps and [in edge cases with some android devices.](https://github.com/react-native-community/async-storage/issues/159)

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

<!-- ------------------------ COMPONENTS ------------------------ -->

export const PlatformSupport = ({platformIcon, title}) => (
    <div style={{
        display: 'flex',
        margin: '10px 20px',
        alignItems: 'center',
        flexDirection: 'row'
    }}>
      <img
       style={{width: 34, height: 34}}
       src={`/async-storage/img/${platformIcon}`} />
      <p style={{margin: '0 0 0 10px', padding: 0}}>{title}</p>
    </div>
  );
