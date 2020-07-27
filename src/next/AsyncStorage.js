/**
 * Copyright (c) Krzysztof Borowy
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */


import ASNativeModule from './NativeModule';
import type {EntryType, KeyType, ValueType} from './NativeModule';


/**
 todo:
 1. Match public API
 2. Merge API implementation
 */
class AsyncStorage {

  /**
   * Read a value for given 'key'
   */
  async getItem(key: KeyType): Promise<ValueType> {
    return ASNativeModule.getSingle(key);
  }

  /**
   * Saves 'value' for given 'key'
   */
  async setItem(key: KeyType, value: ValueType): Promise<boolean> {
    return ASNativeModule.setSingle(key, value);
  }

  /**
   * Remove entry for given 'key'
   */
  async removeItem(key: KeyType): Promise<boolean> {
    return ASNativeModule.deleteSingle(key);
  }

  /**
   * Reads values for given list of keys
   */
  async multiGet(keys: KeyType[]): Promise<EntryType> {
    return ASNativeModule.getMany(keys);
  }

  /**
   * Save multiple entry in one batch
   */
  async multiSet(entry: EntryType): Promise<boolean> {
    return ASNativeModule.setMany(entry);
  }

  /**
   * remove multiple items in one batch
   */
  async multiRemove(keys: KeyType[]): Promise<boolean> {
    return ASNativeModule.deleteMany(keys);
  }

  /**
   * Returns all keys used to store data
   */
  async getAllKeys(): Promise<KeyType[]> {
    return ASNativeModule.getAllKeys();
  }

  /**
   * Removes all values from database
   */
  async clear(): Promise<boolean> {
    return ASNativeModule.dropDatabase();
  }

}

export default new AsyncStorage();
