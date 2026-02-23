---
title: FAQ
---

# Frequently Asked Questions

## General

### How do I store objects, arrays or other non-string values?

AsyncStorage only stores strings. Serialize values with `JSON.stringify` before writing, and `JSON.parse` when reading:

```typescript
import { createAsyncStorage } from "@react-native-async-storage/async-storage";

const storage = createAsyncStorage("my-app");

// Storing an object
const user = { name: "John", age: 30 };
await storage.setItem("user", JSON.stringify(user));

// Reading it back
const raw = await storage.getItem("user");
const user = raw ? JSON.parse(raw) : null;
```

### Is there a way to use the old v2-style singleton?

Yes. The default export is a backward-compatible v2 instance:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

await AsyncStorage.getItem("key");
```

This uses the same legacy API as v2, including `multiGet`, `multiSet`, etc. If you are starting a new integration,
prefer `createAsyncStorage` instead. See the [Migration guide](migration-to-3.md) for the full API comparison.

---

## Integrations

### Redux Persist

The v3 `AsyncStorage` instance implements exactly the storage interface Redux Persist expects (`getItem`, `setItem`,
`removeItem`), so you can pass an instance directly as the `storage` option:

```typescript
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers, createStore } from "redux";

const storage = createAsyncStorage("redux");

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  // your reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
```

!!! tip "Use default export for migration from v2"
The default export (`import AsyncStorage from "..."`) implements the same interface and can be passed as `storage` too.
It allows for gradual migration to v3.

### TanStack Query

TanStack Query's `@tanstack/query-async-storage-persister` package expects a storage object with `getItem`, `setItem`,
and `removeItem`. The v3 AsyncStorage instance matches this interface directly:

```jsx
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const storage = createAsyncStorage("tanstack-query");
const persister = createAsyncStoragePersister({ storage });

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <YourApp />
    </PersistQueryClientProvider>
  );
}
```

!!! note "Required packages"
Install `@tanstack/query-async-storage-persister` and `@tanstack/react-query-persist-client` separately.

### Zustand

Zustand's `persist` middleware accepts a custom storage adapter via `createJSONStorage`. Pass a factory function
returning an AsyncStorage instance:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";

const storage = createAsyncStorage("zustand");

interface BearState {
  bears: number;
  addBear: () => void;
  reset: () => void;
}

export const useBearStore = create<BearState>()(
  persist(
    (set) => ({
      bears: 0,
      addBear: () => set((state) => ({ bears: state.bears + 1 })),
      reset: () => set({ bears: 0 }),
    }),
    {
      name: "bear-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);
```

`createJSONStorage` handles serialization, so you don't need to manually call `JSON.stringify` / `JSON.parse`.

---

## Error handling

### How do I handle errors from AsyncStorage?

All AsyncStorage methods throw `AsyncStorageError` on failure. Use a try/catch block and inspect `e.type` to handle
specific failure modes:

```typescript
import {
  AsyncStorageError,
  createAsyncStorage,
} from "@react-native-async-storage/async-storage";

const storage = createAsyncStorage("my-app");

try {
  await storage.setItem("key", "value");
} catch (e) {
  if (e instanceof AsyncStorageError) {
    console.error(`Storage error [${e.type}]: ${e.message}`);
  }
}
```

See the [Error handling](api/errors.md) guide for the full list of error types and what each one means.

### What happens if a batch operation partially fails?

Batch operations (`setMany`, `getMany`, `removeMany`) are atomic. If any part of the operation fails, the entire batch
is rolled back and an `AsyncStorageError` is thrown. No partial writes will be committed.
