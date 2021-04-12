---
id: brownfield
title: Brownfield integration
sidebar_label: Brownfield integration
---
import PlatformSupport from "../../src/components/Platform.js"

**Supported platforms:**
<PlatformSupport title="iOS/MacOS" platformIcon="icon_ios.svg"></PlatformSupport>
<PlatformSupport title="Android" platformIcon="icon_android.svg"></PlatformSupport>

---

# iOS

If you're embedding React Native into native application, you can also integrate
Async Storage module, so that both worlds will use one storage solution.


AsyncStorage can be controlled by the hosting app via the delegate on
`RNCAsyncStorage`:

```objc
RNCAsyncStorage *asyncStorage = [bridge moduleForClass:[RNCAsyncStorage class]];
asyncStorage.delegate = self;
```



## The procotol

The delegate must conform to the `RNCAsyncStorageDelegate` protocol:



### allKeys

```objc
- (void)allKeys:(RNCAsyncStorageResultCallback)block;
```

Returns all keys currently stored. If none, an empty array is returned.
Called by `getAllKeys` in JS.



### mergeValues

```objc
- (void)mergeValues:(NSArray<NSString *> *)values
            forKeys:(NSArray<NSString *> *)keys
         completion:(RNCAsyncStorageResultCallback)block;
```

Merges values with the corresponding values stored at specified keys.
Called by `mergeItem` and `multiMerge` in JS.



### removeAllValues

```objc
- (void)removeAllValues:(RNCAsyncStorageCompletion)block;
```

Removes all values from the store. Called by `clear` in JS.



### removeValuesForKeys

```objc
- (void)removeValuesForKeys:(NSArray<NSString *> *)keys
                 completion:(RNCAsyncStorageResultCallback)block;
```

Removes all values associated with specified keys.
Called by `removeItem` and `multiRemove` in JS.



### setValues

```objc
- (void)setValues:(NSArray<NSString *> *)values
          forKeys:(NSArray<NSString *> *)keys
       completion:(RNCAsyncStorageResultCallback)block;
```

Sets specified key-value pairs. Called by `setItem` and `multiSet` in JS.



### valuesForKeys

```objc
- (void)valuesForKeys:(NSArray<NSString *> *)keys
           completion:(RNCAsyncStorageResultCallback)block;
```

Returns values associated with specified keys.
Called by `getItem` and `multiGet` in JS.



### passthrough

```objc
@optional
@property (nonatomic, readonly, getter=isPassthrough) BOOL passthrough;
```

**Optional:** Returns whether the delegate should be treated as a passthrough.
This is useful for monitoring storage usage among other things. Returns `NO` by
default.

---

# Android

The recommended approach here is to use Kotlin language to leverage coroutines when accessing the storage.
Java is also supported (through Kotlin interop), but the approach is more cumbersome.


## Prerequisites

1. [Next storage feature](Next.md) enabled.
2. Add dependency on `coroutines-android` in your app's `build.gradle`

```diff

dependencies {
  // other dependencies


  // will work with coroutines 1.3.0 and up
+ implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.9"

}
```

3. Your library of choice for parsing JSON storage values (since there are strings only)


## Access storage

### Kotlin (recommended)

We use Coroutines to handle asynchronous code. Each method on storage is `suspend` method, so you need to
call it from within a coroutine.


#### Reading value

```kotlin
suspend fun readValue(ctx: Context, keys: List<String>) {
    // get instance of the Storage by providing context object
    val asyncStorage = StorageModule.getStorageInstance(ctx)

    val entries: List<Entry> = asyncStorage.getValues(keys)
    doSomethingWithValues(entries)
}
```

#### Saving value

```kotlin
suspend fun saveValue(ctx: Context) {
    val asyncStorage = StorageModule.getStorageInstance(ctx)

    val entries = listOf(
        Entry("myKey", "myValue")
    )
    asyncStorage.setValues(entries)
}
```


### Java

You can access AsyncStorage form Java, but you're still required to add Kotlin dependencies.
There's no one way of accessing the data and there's more than one way to parse it.


#### Reading from storage

```java
void readStorageValue(Context ctx, String key) {
    AsyncStorageAccess asyncStorage = StorageModule.getStorageInstance(ctx);

    BuildersKt.launch(GlobalScope.INSTANCE,
                Dispatchers.getIO(),
                CoroutineStart.DEFAULT,
                (scope, continuation) -> {
                    List<String> keys = new ArrayList<>();
                    keys.add(key);

                    Continuation<? super List<? extends Entry>> cont = new Continuation() {
                        @NotNull
                        @Override
                        public CoroutineContext getContext() {
                            return scope.getCoroutineContext();
                        }

                        @Override
                        public void resumeWith(@NotNull Object o) {
                            List<Entry> entries = (List<Entry>) o;
                            doSomethingWithEntries(entries);
                        }
                    };

                    asyncStorage.getValues(keys, cont);
                    return Unit.INSTANCE;
                });

}
```


#### Saving to storage

```java
void saveStorageValue(Context ctx, String key, String value) {
  AsyncStorageAccess asyncStorage = StorageModule.getStorageInstance(ctx);

  BuildersKt.launch(GlobalScope.INSTANCE,
                Dispatchers.getIO(),
                CoroutineStart.DEFAULT,
                (scope, continuation) -> {
                    Continuation cont = new Continuation() {
                        @NotNull
                        @Override
                        public CoroutineContext getContext() {
                            return scope.getCoroutineContext();
                        }

                        @Override
                        public void resumeWith(@NotNull Object o) {}
                    };

                    List<Entry> entries = new ArrayList<>();
                    Entry entry = new Entry(key, value);
                    entries.add(entry);
                    asyncStorage.setValues(entries, cont);
                    return Unit.INSTANCE;
                });
}
```

