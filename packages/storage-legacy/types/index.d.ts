/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  IStorageBackend,
  StorageOptions,
} from '@react-native-community/async-storage';
export default class LegacyAsyncStorage<T = any> implements IStorageBackend<T> {
  private readonly _asyncStorageNativeModule;
  constructor();
  getSingle(key: string, opts?: StorageOptions): Promise<T | null>;
  setSingle(key: string, value: T, opts?: StorageOptions): Promise<void>;
  getMany(keys: Array<string>, opts?: StorageOptions): Promise<Array<T | null>>;
  setMany(
    values: Array<{
      [key: string]: T;
    }>,
    opts?: StorageOptions,
  ): Promise<void>;
  removeSingle(key: string, opts?: StorageOptions): Promise<void>;
  removeMany(keys: Array<string>, opts?: StorageOptions): Promise<void>;
  getKeys(opts?: StorageOptions): Promise<Array<string>>;
  dropStorage(opts?: StorageOptions): Promise<void>;
}
