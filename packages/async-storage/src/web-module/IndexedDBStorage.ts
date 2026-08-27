import { AsyncStorageError } from "../AsyncStorageError";
import registry from "./IndexedDBConnectionRegistry";

class IndexedDBStorage {
  constructor(private dbName: string) {}

  getValues = async (
    keys: string[]
  ): Promise<{ key: string; value: string | null }[]> => {
    try {
      const db = await this.db();
      const tx = db.transaction(registry.TableName, "readonly");
      const store = tx.objectStore(registry.TableName);

      const [result] = await Promise.all([
        Promise.all(
          keys.map(async (key) => {
            const entry = await store.get(key);
            return { key, value: entry ?? null };
          })
        ),
        tx.done,
      ]);
      return result;
    } catch (e: any) {
      throw this.createError(e);
    }
  };

  setValues = async (
    values: { key: string; value: string | null }[]
  ): Promise<{ key: string; value: string | null }[]> => {
    try {
      const db = await this.db();
      const tx = db.transaction(registry.TableName, "readwrite");
      const store = tx.objectStore(registry.TableName);

      const [result] = await Promise.all([
        Promise.all(
          values.map(async (entry) => {
            await store.put(entry.value, entry.key);
            return { key: entry.key, value: entry.value };
          })
        ),
        tx.done,
      ]);
      return result;
    } catch (e: any) {
      throw this.createError(e);
    }
  };

  removeValues = async (keys: string[]): Promise<void> => {
    try {
      const db = await this.db();
      const tx = db.transaction(registry.TableName, "readwrite");
      const store = tx.objectStore(registry.TableName);

      await Promise.all([
        tx.done,
        ...keys.map(async (key) => await store.delete(key)),
      ]);
    } catch (e: any) {
      throw this.createError(e);
    }
  };

  clearStorage = async (): Promise<void> => {
    try {
      const db = await this.db();
      await db.clear(registry.TableName);
    } catch (e: any) {
      throw this.createError(e);
    }
  };

  getKeys = async (): Promise<string[]> => {
    try {
      const db = await this.db();
      return await db.getAllKeys(registry.TableName);
    } catch (e: any) {
      throw this.createError(e);
    }
  };

  private db = () => registry.getOrCreate(this.dbName);

  private createError(e: any): AsyncStorageError {
    if (e instanceof AsyncStorageError) {
      return e;
    }
    return AsyncStorageError.jsError(
      e?.message ?? `IndexedDB error: ${e}`,
      AsyncStorageError.Type.WebStorageError
    );
  }
}

export default IndexedDBStorage;
