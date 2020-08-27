/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import merge from 'deep-assign';
import localForage from 'localforage';

const mergeLocalStorageItem = async (key, value) => {
  const oldValue = await localForage.getItem(key);
  const oldObject = typeof oldValue === 'string' ? JSON.parse(oldValue) : oldValue;
  const newObject = typeof value === 'string' ? JSON.parse(value) : value;
  const nextValue = merge({}, oldObject, newObject);
  return localForage.setItem(key, nextValue);
};

const createPromiseAll = (promises, callback, processResult): Promise<*> => {
  return Promise.all(promises).then(
    result => {
      const value = processResult ? processResult(result) : null;
      callback && callback(null, value);
      return Promise.resolve(value);
    },
    errors => {
      callback && callback(errors);
      return Promise.reject(errors);
    }
  );
};

export default class AsyncStorage {

  /**
   * Fetches `key` value.
   */
  static async getItem(key: string, callback?: Function): Promise<*> {
    try {
      const value = await localForage.getItem(key);
      const returnValue = value ? JSON.stringify(value) : null;

      if (callback) {
        return callback(null, returnValue);
      }

      return returnValue;
    } catch (error) {
      if (callback) {
        return callback(error, null);
      }

      throw error;
    }
  }

  /**
   * Sets `value` for `key`.
   */
  static setItem(key: string, value: string, callback?: Function): Promise<*> {
    if (callback) {
      return localForage.setItem(key, value, callback);
    }

    return localForage.setItem(key, value);
  }

  /**
   * Removes a `key`
   */
  static removeItem(key: string, callback?: Function): Promise<*> {
    if (callback) {
      return localForage.removeItem(key, callback);
    }

    return localForage.removeItem(key);
  }

  /**
   * Merges existing value with input value, assuming they are stringified JSON.
   */
  static async mergeItem(key: string, value: string, callback?: Function): Promise<*> {
    try {
      await mergeLocalStorageItem(key, value);
      callback && callback(null);
    } catch (error){
      if (callback) {
        return callback(error);
      }
      throw error;
    }
  }

  /**
   * Erases *all* AsyncStorage for the domain.
   */
  static clear(callback?: Function): Promise<*> {
    if (callback) {
      return localForage.clear(callback);
    }

    return localForage.clear();
  }

  /**
   * Gets *all* keys known to the app, for all callers, libraries, etc.
   */
  static getAllKeys(callback?: Function): Promise<*> {
    if (callback) {
      return localForage.keys(callback);
    }

    return localForage.keys();
  }

  /**
   * (stub) Flushes any pending requests using a single batch call to get the data.
   */
  static flushGetRequests() {}

  /**
   * multiGet resolves to an array of key-value pair arrays that matches the
   * input format of multiSet.
   *
   *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
   */
  static multiGet(keys: Array<string>, callback?: Function): Promise<*> {
    const promises = keys.map(key => AsyncStorage.getItem(key));
    const processResult = result => result.map((value, i) => [keys[i], value]);
    return createPromiseAll(promises, callback, processResult);
  }

  /**
   * Takes an array of key-value array pairs.
   *   multiSet([['k1', 'val1'], ['k2', 'val2']])
   */
  static multiSet(keyValuePairs: Array<Array<string>>, callback?: Function): Promise<*> {
    const promises = keyValuePairs.map(item => AsyncStorage.setItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  }

  /**
   * Delete all the keys in the `keys` array.
   */
  static multiRemove(keys: Array<string>, callback?: Function): Promise<*> {
    const promises = keys.map(key => AsyncStorage.removeItem(key));
    return createPromiseAll(promises, callback);
  }

  /**
   * Takes an array of key-value array pairs and merges them with existing
   * values, assuming they are stringified JSON.
   *
   *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
   */
  static multiMerge(keyValuePairs: Array<Array<string>>, callback?: Function): Promise<*> {
    const promises = keyValuePairs.map(item => AsyncStorage.mergeItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  }
}
