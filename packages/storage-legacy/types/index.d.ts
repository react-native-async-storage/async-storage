/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  EmptyStorageModel,
  IStorageBackend,
  StorageOptions,
} from '@react-native-community/async-storage';
export default class LegacyAsyncStorage<T = EmptyStorageModel>
  implements IStorageBackend<T> {
  private readonly _asyncStorageNativeModule;

  getSingle<K extends keyof T>(
    key: K,
    opts?: StorageOptions,
  ): Promise<T[K] | null>;

  setSingle<K extends keyof T>(
    key: K,
    value: T[K],
    opts?: StorageOptions,
  ): Promise<void>;

  getMany<K extends keyof T>(
    keys: Array<K>,
    opts?: StorageOptions,
  ): Promise<{[k in K]: T[k] | null}>;

  setMany<K extends keyof T>(
    values: Array<{[k in K]: T[k]}>,
    opts?: StorageOptions,
  ): Promise<void>;

  removeSingle(key: keyof T, opts?: StorageOptions): Promise<void>;

  removeMany(keys: Array<keyof T>, opts?: StorageOptions): Promise<void>;

  getKeys(opts?: StorageOptions): Promise<Array<keyof T>>;

  dropStorage(opts?: StorageOptions): Promise<void>;
}
