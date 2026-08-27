import type { AsyncStorage } from "./AsyncStorage";
import NativeAsyncStorage, {
  type Spec as NativeAsyncStorageSpec,
} from "./native-module/NativeAsyncStorage";
import { AsyncStorageError } from "./AsyncStorageError";
import { Platform } from "react-native";

let visionOsWarned = false;

/**
 * Creates a new AsyncStorage instance bound to a given database name.
 * @param databaseName - The name of the database to open or create.
 */
export function createAsyncStorage(databaseName: string): AsyncStorage {
  if (Platform.OS === "ios" && Platform.isVision) {
    if (!visionOsWarned) {
      visionOsWarned = true;
      // eslint-disable-next-line
      console.warn(
        "[AsyncStorage] Warning: Creating custom storages is not supported on visionOS. Falling back to the legacy implementation."
      );
    }
    return getLegacyStorage();
  }

  return new AsyncStorageImpl(databaseName);
}

/**
 * AsyncStorage implementation backed by the shared-storage module.
 * Each instance operates on a separate database identified by `dbName`.
 */
class AsyncStorageImpl implements AsyncStorage {
  constructor(private readonly dbName: string) {}

  private get db(): NativeAsyncStorageSpec {
    const mod = NativeAsyncStorage;
    if (!mod) {
      throw AsyncStorageError.jsError(
        `Native module is null, cannot create db`,
        AsyncStorageError.Type.NativeModuleError
      );
    }
    return mod;
  }

  getItem = async (key: string): Promise<string | null> => {
    try {
      const result = await this.db.getValues(this.dbName, [key]);
      const value = result?.[0] ?? null;
      return value?.value ?? null;
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  setItem = async (key: string, value: string): Promise<void> => {
    try {
      await this.db.setValues(this.dbName, [{ key, value }]);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  removeItem = async (key: string): Promise<void> => {
    try {
      await this.db.removeValues(this.dbName, [key]);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  getMany = async (keys: string[]): Promise<Record<string, string | null>> => {
    try {
      const entries = await this.db.getValues(this.dbName, keys);
      return Object.fromEntries(entries.map(({ key, value }) => [key, value]));
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  setMany = async (entries: Record<string, string>): Promise<void> => {
    try {
      await this.db.setValues(
        this.dbName,
        Object.entries(entries).map(([key, value]) => ({ key, value }))
      );
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  removeMany = async (keys: string[]): Promise<void> => {
    try {
      await this.db.removeValues(this.dbName, keys);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  getAllKeys = async (): Promise<string[]> => {
    try {
      return await this.db.getKeys(this.dbName);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  clear = async (): Promise<void> => {
    try {
      await this.db.clearStorage(this.dbName);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };
}

/**
 * Returns a singleton instance of the legacy (v2) AsyncStorage implementation.
 *
 * ⚠️ Usage is discouraged. This is provided only as a migration path to v3.
 */
export function getLegacyStorage(): AsyncStorage {
  return LegacyAsyncStorageImpl.instance;
}

/**
 * Legacy AsyncStorage implementation, backed by the old native module API.
 * Singleton to ensure consistent state across calls.
 */
class LegacyAsyncStorageImpl implements AsyncStorage {
  private constructor() {}

  static instance = new LegacyAsyncStorageImpl();

  private get db(): NativeAsyncStorageSpec {
    const mod = NativeAsyncStorage;
    if (!mod) {
      throw AsyncStorageError.jsError(
        `Native module is null, cannot access legacy storage`,
        AsyncStorageError.Type.NativeModuleError
      );
    }
    return mod;
  }

  getItem = async (key: string): Promise<string | null> => {
    try {
      const result = await this.db.legacy_multiGet([key]);
      const entry = result?.[0] ?? null;
      return entry?.[1] ?? null;
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  setItem = async (key: string, value: string): Promise<void> => {
    try {
      await this.db.legacy_multiSet([[key, value]]);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  removeItem = async (key: string): Promise<void> => {
    try {
      await this.db.legacy_multiRemove([key]);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  getMany = async (keys: string[]): Promise<Record<string, string | null>> => {
    try {
      const entries = await this.db.legacy_multiGet(keys);
      return Object.fromEntries(
        entries.map(([key, value]) => [key, value ?? null])
      );
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  setMany = async (entries: Record<string, string>): Promise<void> => {
    try {
      await this.db.legacy_multiSet(Object.entries(entries));
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  removeMany = async (keys: string[]): Promise<void> => {
    try {
      await this.db.legacy_multiRemove(keys);
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  getAllKeys = async (): Promise<string[]> => {
    try {
      return await this.db.legacy_getAllKeys();
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };

  clear = async (): Promise<void> => {
    try {
      await this.db.legacy_clear();
    } catch (e) {
      throw AsyncStorageError.nativeError(e);
    }
  };
}
