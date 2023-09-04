import { StorageBackend } from "./types/StorageBackend";
import { StorageConfig } from "./types/StorageConfig";
import {
  DefaultStorageModel,
  StorageModel,
  StorageEntry,
} from "./types/StorageModel";
import { AsyncStorage } from "./types/AsyncStorage";
import Storage from "./Storage";
import { StorageExtension } from "./types/Extension";
import { DefaultAdapter } from "./default-adapter";

export {
  AsyncStorage,
  StorageBackend,
  StorageEntry,
  StorageConfig,
  StorageModel,
  StorageExtension,
};

class AsyncStorageFactory {
  private constructor() {}

  static create<E extends StorageExtension | undefined>(
    storage: StorageBackend<E>
  ): AsyncStorage<DefaultStorageModel, E> {
    return new Storage<DefaultStorageModel, E>(storage, {
      adapter: DefaultAdapter,
    });
  }
}

export default AsyncStorageFactory;
