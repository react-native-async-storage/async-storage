---
title: Brownfield integration
---

# Brownfield integration

!!! info

    Brownfield integration is supported on **Android**, **iOS**, and **macOS**.

`AsyncStorage` is built on a shared storage layer (`SharedStorage`) that can also be accessed directly from native
code.  
This is especially useful in brownfield scenarios, where your app combines React Native and native code, allowing both
layers to read from and write to the same storage consistently.

All platforms provide a thread-safe singleton registry called `StorageRegistry` to manage storage instances.

### Android

On Android, `StorageRegistry` is a public singleton, which is used to share `SharedStorage` instances with the native module.
Multiple calls with the same name return the same singleton instance, ensuring consistent access.

```kotlin
import android.content.Context
import kotlinx.coroutines.runBlocking
import org.asyncstorage.shared_storage.Entry
import org.asyncstorage.shared_storage.SharedStorage
import org.asyncstorage.storage.StorageRegistry

// access shared storage via StorageRegistry
val storage: SharedStorage = StorageRegistry.getStorage(ctx, "my-users")

// runBlocking only for a demonstration
runBlocking {
    storage.setValues(listOf(Entry("email", "john@example.com")))
    val values = storage.getValues(listOf("email"))
    println("Stored email: ${values.firstOrNull()?.value}")
}
```

### iOS / macOS

On iOS and macOS, the `StorageRegistry` singleton provides the same functionality in Swift and Objective-C.

```swift
import AsyncStorage
import SharedAsyncStorage

// access shared storage via StorageRegistry
let storage: SharedStorage = StorageRegistry.shared.getStorage(dbName: "my-users")

Task {
    storage.setValues([Entry(key: "email", value: "john@example.com")])
    let values = storage.getValues(keys: ["email"])
    print("Stored email: \(values.first?.value ?? "none")")
}
```
