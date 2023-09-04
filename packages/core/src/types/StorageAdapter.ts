import { StorageKeys, StorageModel } from "./StorageModel";

export interface StorageAdapter<S extends StorageModel> {
  serialize<K extends StorageKeys<S>>(
    key: K,
    value: S[K] | null
  ): string | null;

  deserialize<K extends StorageKeys<S>>(
    key: K,
    value: string | null
  ): S[K] | null;
}
