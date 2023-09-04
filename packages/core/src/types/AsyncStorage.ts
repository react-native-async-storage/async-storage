import { StorageKeys, StorageModel } from "./StorageModel";
import { StorageExtension } from "./Extension";

export interface AsyncStorage<
  S extends StorageModel,
  E extends StorageExtension | undefined
> {
  getItem<K extends StorageKeys<S>>(key: K): Promise<S[K] | null>;
  setItem<K extends StorageKeys<S>>(key: K, value: S[K]): Promise<void>;
  removeItem<K extends StorageKeys<S>>(key: K): Promise<void>;

  getMany<K extends StorageKeys<S>>(
    keys: K[]
  ): Promise<{ [k in K]: S[k] | null }>;

  setMany<K extends StorageKeys<S>>(entries: {
    [k in K]: S[k] | null;
  }): Promise<void>;

  removeMany<K extends StorageKeys<S>>(keys: K[]): Promise<void>;

  clear(): Promise<void>;

  ext: E;
}
