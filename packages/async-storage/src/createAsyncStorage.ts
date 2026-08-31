import type { AsyncStorage } from "./AsyncStorage";
import { AsyncStorageError } from "./AsyncStorageError";
import IndexedDBStorage from "./web-module/IndexedDBStorage";

/**
 * Creates a new AsyncStorage instance bound to a given database name.
 * @param databaseName - The name of the database to open or create.
 */
export function createAsyncStorage(databaseName: string): AsyncStorage {
  return new AsyncStorageWebImpl(databaseName);
}

/**
 * AsyncStorage implementation for web using IndexedDB.
 * Each instance operates on its own IndexedDB database.
 */
class AsyncStorageWebImpl implements AsyncStorage {
  private db: IndexedDBStorage;

  constructor(dbName: string) {
    this.db = new IndexedDBStorage(dbName);
  }

  getItem = async (key: string): Promise<string | null> => {
    try {
      const result = await this.db.getValues([key]);
      const value = result?.[0] ?? null;
      return value?.value ?? null;
    } catch (e) {
      throw this.createError(e);
    }
  };

  setItem = async (key: string, value: string): Promise<void> => {
    try {
      await this.db.setValues([{ key, value }]);
    } catch (e) {
      throw this.createError(e);
    }
  };

  removeItem = async (key: string): Promise<void> => {
    try {
      await this.db.removeValues([key]);
    } catch (e) {
      throw this.createError(e);
    }
  };

  getMany = async (keys: string[]): Promise<Record<string, string | null>> => {
    try {
      const entries = await this.db.getValues(keys);
      return Object.fromEntries(entries.map(({ key, value }) => [key, value]));
    } catch (e) {
      throw this.createError(e);
    }
  };

  setMany = async (entries: Record<string, string>): Promise<void> => {
    try {
      await this.db.setValues(
        Object.entries(entries).map(([key, value]) => ({ key, value }))
      );
    } catch (e) {
      throw this.createError(e);
    }
  };

  removeMany = async (keys: string[]): Promise<void> => {
    try {
      await this.db.removeValues(keys);
    } catch (e) {
      throw this.createError(e);
    }
  };

  getAllKeys = async (): Promise<string[]> => {
    try {
      return await this.db.getKeys();
    } catch (e) {
      throw this.createError(e);
    }
  };

  clear = async (): Promise<void> => {
    try {
      await this.db.clearStorage();
    } catch (e) {
      throw this.createError(e);
    }
  };

  private createError(e: any): AsyncStorageError {
    if (e instanceof AsyncStorageError) {
      return e;
    }
    return AsyncStorageError.jsError(
      e?.message ?? `Web storage error: ${e}`,
      AsyncStorageError.Type.WebStorageError
    );
  }
}

/**
 * Returns a singleton instance of the legacy (v2) web AsyncStorage implementation.
 *
 * ⚠️ Usage is discouraged. This is provided only as a migration path to v3.
 */
export function getLegacyStorage(): AsyncStorage {
  return LegacyAsyncStorageWebImpl.instance;
}

/**
 * Legacy AsyncStorage implementation, backed by LocalStorage Web API.
 * Singleton to ensure consistent state across calls.
 */
class LegacyAsyncStorageWebImpl implements AsyncStorage {
  private constructor() {}
  static instance = new LegacyAsyncStorageWebImpl();

  private get storage() {
    return window.localStorage;
  }

  getItem = async (key: string): Promise<string | null> => {
    return this.storage.getItem(key) ?? null;
  };

  setItem = async (key: string, value: string): Promise<void> => {
    this.storage.setItem(key, value);
  };

  removeItem = async (key: string): Promise<void> => {
    this.storage.removeItem(key);
  };

  getMany = async (keys: string[]): Promise<Record<string, string | null>> => {
    return Object.fromEntries(
      keys.map((key) => [key, this.storage.getItem(key) ?? null])
    );
  };

  setMany = async (entries: Record<string, string>): Promise<void> => {
    Object.entries(entries).forEach(([key, value]) => {
      this.storage.setItem(key, value);
    });
  };

  removeMany = async (keys: string[]): Promise<void> => {
    keys.forEach((key) => {
      this.storage.removeItem(key);
    });
  };

  getAllKeys = async (): Promise<string[]> => {
    return Object.keys(this.storage);
  };

  clear = async (): Promise<void> => {
    this.storage.clear();
  };
}
