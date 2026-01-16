import AsyncStorage from "./AsyncStorage";
import type {
  AsyncStorageHook,
  AsyncStorageObjectHook,
  Callback,
  CallbackWithResult,
} from "./types";

export function useAsyncStorage(key: string): AsyncStorageHook {
  return {
    getItem: (...args) => AsyncStorage.getItem(key, ...args),
    setItem: (...args) => AsyncStorage.setItem(key, ...args),
    mergeItem: (...args) => AsyncStorage.mergeItem(key, ...args),
    removeItem: (...args) => AsyncStorage.removeItem(key, ...args),
  };
}

export function useAsyncStorageObject<T>(
  key: string,
  defaultValue?: T
): AsyncStorageObjectHook<T> {
  return {
    getItem: async (
      callback?: CallbackWithResult<T>
    ): Promise<T | null> => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value === null) {
          const result = defaultValue ?? null;
          callback?.(null, result);
          return result;
        }
        const parsed = JSON.parse(value) as T;
        callback?.(null, parsed);
        return parsed;
      } catch (error) {
        const result = defaultValue ?? null;
        callback?.(null, result);
        return result;
      }
    },
    setItem: async (value: T, callback?: Callback): Promise<void> => {
      const stringified = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringified, callback);
    },
    mergeItem: async (
      value: Partial<T>,
      callback?: Callback
    ): Promise<void> => {
      const stringified = JSON.stringify(value);
      await AsyncStorage.mergeItem(key, stringified, callback);
    },
    removeItem: (...args) => AsyncStorage.removeItem(key, ...args),
  };
}
