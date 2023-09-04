import { DefaultStorageModel, StorageKeys } from "./types/StorageModel";
import { StorageAdapter } from "./types/StorageAdapter";

export const DefaultAdapter: StorageAdapter<DefaultStorageModel> = {
  deserialize<K extends StorageKeys<DefaultStorageModel>>(
    _: K,
    value: string | null
  ): DefaultStorageModel[K] | null {
    return value;
  },
  serialize<K extends StorageKeys<DefaultStorageModel>>(
    _: K,
    value: DefaultStorageModel[K] | null
  ): string | null {
    return value;
  },
};
