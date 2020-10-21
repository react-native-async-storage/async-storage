---
id: brownfield
title: Brownfield integration
sidebar_label: Brownfield integration
---
import PlatformSupport from "../../src/components/Platform.js"

**Supported platforms:**
<PlatformSupport title="iOS/MacOS" platformIcon="icon_ios.svg"></PlatformSupport>

---

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
