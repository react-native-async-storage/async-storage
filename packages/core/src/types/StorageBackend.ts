import { StorageExtension } from "./Extension";
import { StorageEntry } from "./StorageModel";

export interface StorageBackend<E extends StorageExtension | undefined> {
  multiGet(keys: readonly string[]): Promise<StorageEntry>;
  multiSet(entries: StorageEntry): Promise<StorageEntry>;
  multiRemove(keys: readonly string[]): Promise<void>;
  drop(): Promise<void>;
  extension: E;
}
