/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import AsyncStorage from './AsyncStorage';
import {factoryOptions} from './defaults';
import {IStorageBackend, FactoryOptions, EmptyStorageModel} from '../types';

class AsyncStorageFactory {
  constructor() {
    throw new Error(
      "[AsyncStorage] AsyncStorageFactory must not be instantiated.\nInstead, use static functions, like 'create' to get AsyncStorage instance.",
    );
  }

  static create<M = EmptyStorageModel>(
    storage: IStorageBackend,
    opts: FactoryOptions = factoryOptions,
  ) {
    return new AsyncStorage<M, IStorageBackend<M>>(storage, opts);
  }
}

export default AsyncStorageFactory;
