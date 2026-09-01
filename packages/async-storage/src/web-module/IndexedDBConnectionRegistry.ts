import type { DBSchema, IDBPDatabase } from "idb";
import { openDB } from "idb";
import { AsyncStorageError } from "../AsyncStorageError";

const WebStorageTableName = "entries" as const;

export interface AsyncStorageWeb extends DBSchema {
  [WebStorageTableName]: {
    key: string;
    value: string | null;
  };
}

/**
 * Registry to keep one IndexedDB connection per database name.
 */
class IndexedDBConnectionRegistry {
  private registry: Map<string, Promise<IDBPDatabase<AsyncStorageWeb>>> =
    new Map();

  public TableName = WebStorageTableName;

  public getOrCreate(dbName: string): Promise<IDBPDatabase<AsyncStorageWeb>> {
    if (this.registry.has(dbName)) {
      return this.registry.get(dbName)!;
    }
    const db = openDB<AsyncStorageWeb>(dbName, 1, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains(WebStorageTableName)) {
          db.createObjectStore(WebStorageTableName);
        }
      },
      blocked: (currentVersion: number, blockedVersion: number | null) => {
        throw AsyncStorageError.jsError(
          `New version (${blockedVersion}) is blocked by current one (${currentVersion})`,
          AsyncStorageError.Type.WebStorageError
        );
      },
      blocking: (currentVersion: number, blockedVersion: number | null) => {
        void db.then((connection) => connection.close());
        if (this.registry.get(dbName) === db) {
          this.registry.delete(dbName);
        }
        throw AsyncStorageError.jsError(
          `Current db version (${currentVersion}) is blocking upgrade to next version (${blockedVersion})`,
          AsyncStorageError.Type.WebStorageError
        );
      },
      terminated: () => {
        if (this.registry.get(dbName) === db) {
          this.registry.delete(dbName);
        }
      },
    }).catch((err) => {
      // Return the rejection to callers while allowing a later open to retry.
      if (this.registry.get(dbName) === db) {
        this.registry.delete(dbName);
      }
      throw err;
    });

    this.registry.set(dbName, db);

    return db;
  }
}

export default new IndexedDBConnectionRegistry();
