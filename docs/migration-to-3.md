# Migration to v3

AsyncStorage v3 introduces a few breaking changes to simplify the API and make it more consistent.

## Key changes:

### Requirements

Compatibility table for React Native:

| React Native | Minimum Version |
| ------------ | --------------- |
| ios/android  | 0.76            |
| macOS        | 0.78            |
| visionOS     | 0.79            |
| windows      | 0.79            |

Other components:

| Component        | Version |
| ---------------- | ------- |
| kotlin           | 2.1.0   |
| android min sdk  | 24      |
| ios min target   | 13      |
| macOS min target | 12      |

### Installation changes

No additional Android setup is required — the local Maven repository for `shared-storage` is configured automatically by the library's `build.gradle`.

### `AsyncStorage` is now instance-based

In v3, AsyncStorage is no longer a singleton.  
Each instance represents an **isolated storage area**, providing separation between data sets. Head over to the [Usage page](api/usage.md#creating-a-storage) to learn more.

```typescript
// create separate storages
const userStorage = createAsyncStorage("user");
const cacheStorage = createAsyncStorage("cache");
```

### Default export still points to v2 storage

To make upgrading smoother, the default export continues to reference the v2 implementation.
This ensures that:

- Your app can continue to access previously stored data.
- You can migrate incrementally to v3 instances.

```typescript
// Still works (uses the v2 backend)
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.setItem("foo", "bar");
```

### Callbacks removed - Promises only

All methods are now promise-based.
The old callback arguments have been removed to make the API simpler and more consistent.

### Removed merge functionality

AsyncStorage's "merge" behavior has historically been inconsistent across platforms.
Rather than enforcing a platform-specific merging strategy, the merge API has been removed to avoid ambiguity.

### Removed `useAsyncStorage` hook

The `useAsyncStorage` hook has been removed due to implementation issues.  
It will be reintroduced in a future release with an improved design.

If you need it, here's the old version:

```typescript
export function useAsyncStorage(key: string): AsyncStorageHook {
  return {
    getItem: (...args) => AsyncStorage.getItem(key, ...args),
    setItem: (...args) => AsyncStorage.setItem(key, ...args),
    mergeItem: (...args) => AsyncStorage.mergeItem(key, ...args),
    removeItem: (...args) => AsyncStorage.removeItem(key, ...args),
  };
}
```

### Errors are more predictable now

All errors thrown by `AsyncStorage` are now instances of `AsyncStorageError`, each containing a `type` property that indicates the kind of error.
For more details, head over to the [Errors page](api/errors.md).

### Method signature changes

The core methods:

- `getItem`
- `setItem`
- `removeItem`
- `getAllKeys`
- `clear`

retain their signatures as in v2, ensuring backward compatibility.

#### multiGet

Renamed to `getMany`, this method returns a `Record<string, string | null>` and follows a "what you request is what you get" rule: every key provided in the request appears in the returned object, with `null` for keys that don’t exist, or have `null` value, in storage.

```diff
-  multiGet: (
-    keys: readonly string[],
-    callback?: MultiGetCallback
-  ) => Promise<readonly KeyValuePair[]>;

+ getMany(keys: string[]): Promise<Record<string, string | null>>;
```

#### multiSet

Renamed to `setMany`, this method accepts a `Record<string, string>` containing key-value pairs.

```diff
-  multiSet: (
-    keyValuePairs: ReadonlyArray<readonly [string, string]>,
-    callback?: MultiCallback
-  ) => Promise<void>;

+ setMany(entries: Record<string, string>): Promise<void>;
```

#### multiRemove

Renamed to `removeMany`, this method accepts a list of keys to remove.

```diff
-  multiRemove: (
-    keys: readonly string[],
-    callback?: MultiCallback
-  ) => Promise<void>;

+ removeMany(keys: string[]): Promise<void>;
```
