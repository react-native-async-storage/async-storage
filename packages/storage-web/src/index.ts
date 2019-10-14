/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  IStorageBackend,
  EmptyStorageModel,
  StorageOptions,
} from '@react-native-community/async-storage';

class WebStorage<T extends EmptyStorageModel = EmptyStorageModel>
  implements IStorageBackend<T> {
  storage: any;
  constructor(sessionStorage: boolean | string = false) {
    this.storage = sessionStorage ? window.sessionStorage : window.localStorage;
  }

  async getSingle<K extends keyof T>(
    key: K,
    opts?: StorageOptions,
  ): Promise<T[K] | null> {
    if (opts) {
      // noop
    }
    return this.storage.getItem(key);
  }

  async setSingle<K extends keyof T>(
    key: K,
    value: T[K],
    opts?: StorageOptions,
  ): Promise<void> {
    if (opts) {
      // noop
    }
    return this.storage.setItem(key, value);
  }

  async getMany<K extends keyof T>(
    keys: Array<K>,
    opts?: StorageOptions,
  ): Promise<{[k in K]: T[k] | null}> {
    if (opts) {
      // noop
    }
    return Promise.all(keys.map(k => ({[k]: this.storage.getItem(k)}))).then(
      values => values.reduce((storageObj, pair) => ({...storageObj, ...pair})),
    );
  }

  async setMany<K extends keyof T>(
    values: Array<Partial<{[k in K]: T[k]}>>,
    opts?: StorageOptions,
  ): Promise<void> {
    if (opts) {
      // noop
    }
    for (let keyValue of values) {
      const key = Object.getOwnPropertyNames(keyValue)[0] as K;
      if (!key) {
        continue;
      }
      this.storage.setItem(key, keyValue[key]);
    }
  }

  async removeSingle(key: keyof T, opts?: StorageOptions): Promise<void> {
    if (opts) {
      // noop
    }
    return this.storage.removeItem(key);
  }

  async removeMany(keys: Array<keyof T>, opts?: StorageOptions): Promise<void> {
    if (opts) {
      // noop
    }
    Promise.all(keys.map(k => this.storage.removeItem(k)));
  }

  async getKeys(opts?: StorageOptions): Promise<Array<keyof T>> {
    if (opts) {
      // noop
    }
    return Object.keys(this.storage);
  }

  async dropStorage(opts?: StorageOptions): Promise<void> {
    if (opts) {
      // noop
    }
    const keys = await this.getKeys();
    await this.removeMany(keys);
  }
}

export default WebStorage;
