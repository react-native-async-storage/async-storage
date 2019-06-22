import AsyncStorage from './AsyncStorage';
import {factoryOptions} from './defaults';

class AsyncStorageFactory {
  constructor() {
    throw new Error('Do not instantiate AsyncStorageFactory!');
  }

  static create<STR extends IStorageBackend>(
    storage: STR,
    opts: FactoryOptions = factoryOptions,
  ): AsyncStorage<STR, StorageModelType<STR>> {
    return new AsyncStorage(storage, opts);
  }
}

export default AsyncStorageFactory;
