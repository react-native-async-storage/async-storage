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
} from '@react-native-community/async-storage';

import {
  get as idbGet,
  set as idbSet,
  del as idbDel,
  clear as idbClear,
  keys as idbKeys,
} from 'idb-keyval';

type StorageType = 'idb' | 'local' | 'session';

class WebStorage<T extends EmptyStorageModel = EmptyStorageModel>
  implements IStorageBackend<T> {
  storage: {
    name: string;
    getItem: Function;
    setItem: Function;
    deleteItem: Function;
    keys: Function;
    clear: Function;
  };

  constructor(storageType: StorageType = 'idb') {
    if (storageType === 'idb') {
      this.storage = {
        name: storageType,
        getItem: idbGet,
        setItem: idbSet,
        deleteItem: idbDel,
        keys: idbKeys,
        clear: idbClear,
      };
    } else {
      const webStorage =
        storageType === 'local' ? window.localStorage : window.sessionStorage;

      this.storage = {
        name: storageType,
        getItem: webStorage.getItem.bind(webStorage),
        setItem: webStorage.setItem.bind(webStorage),
        deleteItem: webStorage.removeItem.bind(webStorage),
        keys: () => Object.keys(webStorage),
        clear: webStorage.clear.bind(webStorage),
      };
    }
  }

  async getSingle<K extends keyof T>(key: K): Promise<T[K] | null> {
    return this.storage.getItem(key);
  }

  async setSingle<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    return this.storage.setItem(key, value);
  }

  async getMany<K extends keyof T>(
    keys: Array<K>,
  ): Promise<{[k in K]: T[k] | null}> {
    if (this.storage.name === 'idb') {
      return Promise.all(keys.map(key => this.storage.getItem(key))).then(
        readValues =>
          readValues.reduce((values, currentValue, currentIndex) => {
            const key = keys[currentIndex];
            return {
              ...values,
              [key]: currentValue,
            };
          }, {}),
      );
    }

    return keys.reduce(
      (storageValues, key) => {
        return {
          ...storageValues,
          [key]: this.storage.getItem(key),
        };
      },
      {} as {[k in K]: T[k] | null},
    );
  }

  async setMany<K extends keyof T>(
    values: Array<Partial<{[k in K]: T[k]}>>,
  ): Promise<void> {
    for (let keyValue of values) {
      const key = Object.getOwnPropertyNames(keyValue)[0] as K;
      if (!key) {
        continue;
      }
      await this.storage.setItem(key, keyValue[key]);
    }
  }

  async removeSingle(key: keyof T): Promise<void> {
    return this.storage.deleteItem(key);
  }

  async removeMany(keys: Array<keyof T>): Promise<void> {
    if (this.storage.name === 'idb') {
      for (const key of keys) {
        await this.storage.deleteItem(key);
      }
    } else {
      await Promise.all(keys.map(k => this.storage.deleteItem(k)));
    }
  }

  async getKeys(): Promise<Array<keyof T>> {
    return this.storage.keys();
  }

  async dropStorage(): Promise<void> {
    return this.storage.clear();
  }
}

export default WebStorage;
