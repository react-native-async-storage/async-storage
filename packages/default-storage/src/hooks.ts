import AsyncStorage from "./AsyncStorage";
import type { AsyncStorageHook, AsyncStorageObjectHook } from "./types";

/**
 * Deep merges two objects. Arrays are replaced, not merged.
 * @param target The target object
 * @param source The source object to merge into target
 * @returns A new merged object
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        // Both are objects (not arrays), merge recursively
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        // Otherwise, replace the value
        output[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return output;
}

export function useAsyncStorage(key: string): AsyncStorageHook {
  return {
    getItem: (...args) => AsyncStorage.getItem(key, ...args),
    setItem: (...args) => AsyncStorage.setItem(key, ...args),
    mergeItem: (...args) => AsyncStorage.mergeItem(key, ...args),
    removeItem: (...args) => AsyncStorage.removeItem(key, ...args),
  };
}

export function useAsyncStorageObject<T>(
  key: string
): AsyncStorageObjectHook<T> {
  return {
    getItem: async (): Promise<T | null> => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item === null) {
          return null;
        }
        return JSON.parse(item) as T;
      } catch (error) {
        console.warn(
          `Failed to parse JSON for key "${key}":`,
          error instanceof Error ? error.message : error
        );
        return null;
      }
    },

    setItem: async (value: T): Promise<void> => {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    },

    mergeItem: async (value: Partial<T>): Promise<void> => {
      try {
        const existingItem = await AsyncStorage.getItem(key);
        let existingObject: T;

        if (existingItem === null) {
          // If no existing item, treat the partial value as the full object
          existingObject = value as T;
        } else {
          try {
            existingObject = JSON.parse(existingItem) as T;
          } catch (parseError) {
            console.warn(
              `Failed to parse existing JSON for key "${key}", replacing with new value:`,
              parseError instanceof Error ? parseError.message : parseError
            );
            // If parse fails, treat the new value as the full object
            existingObject = value as T;
          }
        }

        const merged = deepMerge(existingObject, value);
        const stringValue = JSON.stringify(merged);
        await AsyncStorage.setItem(key, stringValue);
      } catch (error) {
        // Re-throw any storage errors
        throw error;
      }
    },

    removeItem: async (): Promise<void> => {
      await AsyncStorage.removeItem(key);
    },
  };
}
