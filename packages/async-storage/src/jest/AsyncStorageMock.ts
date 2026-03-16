import type { AsyncStorage } from "@react-native-async-storage/async-storage";

class AsyncStorageMemoryImpl implements AsyncStorage {
  private store = new Map<string, string>();

  getItem = async (key: string): Promise<string | null> => {
    return this.store.get(key) ?? null;
  };

  setItem = async (key: string, value: string): Promise<void> => {
    this.store.set(key, value);
  };

  removeItem = async (key: string): Promise<void> => {
    this.store.delete(key);
  };

  getMany = async (keys: string[]): Promise<Record<string, string | null>> => {
    return keys.reduce<Record<string, string | null>>((result, key) => {
      result[key] = this.store.get(key) ?? null;
      return result;
    }, {});
  };

  setMany = async (entries: Record<string, string>): Promise<void> => {
    for (const [key, value] of Object.entries(entries)) {
      this.store.set(key, value);
    }
  };

  removeMany = async (keys: string[]): Promise<void> => {
    for (const key of keys) {
      this.store.delete(key);
    }
  };

  getAllKeys = async (): Promise<string[]> => {
    return Array.from(this.store.keys());
  };

  clear = async (): Promise<void> => {
    this.store.clear();
  };
}

const inMemoryDbRegistry = new Map<string, AsyncStorageMemoryImpl>();

export function createAsyncStorage(databaseName: string): AsyncStorage {
  if (!inMemoryDbRegistry.has(databaseName)) {
    inMemoryDbRegistry.set(databaseName, new AsyncStorageMemoryImpl());
  }
  return inMemoryDbRegistry.get(databaseName)!;
}

export function clearAllMockStorages(): void {
  inMemoryDbRegistry.clear();
}

export default createAsyncStorage("legacy");
