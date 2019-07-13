/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {NativeModules} from 'react-native';
import {
  IStorageBackend,
  StorageOptions,
} from '@react-native-community/async-storage';

function convertErrors(errs?: Array<Error> | Error) {
  if (!errs) {
    return null;
  }
  return Array.isArray(errs) ? errs.filter(e => !!e) : [errs];
}

export default class LegacyAsyncStorage<T = any> implements IStorageBackend<T> {
  private readonly _asyncStorageNativeModule: any;

  constructor() {
    this._asyncStorageNativeModule =
      NativeModules.RNC_AsyncSQLiteDBStorage ||
      NativeModules.RNCAsyncStorage ||
      NativeModules.PlatformLocalStorage;

    if (!this._asyncStorageNativeModule) {
      throw new Error(
        '[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.',
      );
    }
  }

  async getSingle(key: string, opts?: StorageOptions): Promise<T | null> {
    if (opts) {
      // noop
    }

    return new Promise<T | null>((resolve, reject) => {
      this._asyncStorageNativeModule.multiGet([key], function(
        errors: Array<Error>,
        result: Array<[any, T | null]>,
      ) {
        const value = result && result[0] && result[0][1] ? result[0][1] : null;
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve(value);
        }
      });
    });
  }

  async setSingle(key: string, value: T, opts?: StorageOptions): Promise<void> {
    if (opts) {
      // noop
    }

    return new Promise<void>((resolve, reject) => {
      this._asyncStorageNativeModule.multiSet([[key, value]], function(
        errors: Array<Error>,
      ) {
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve();
        }
      });
    });
  }

  async getMany(
    keys: Array<string>,
    opts?: StorageOptions,
  ): Promise<Array<T | null>> {
    if (opts) {
      // noop
    }

    return new Promise<Array<T | null>>((resolve, reject) => {
      this._asyncStorageNativeModule.multiGet(keys, function(
        errors: Array<Error>,
        result: any,
      ) {
        const value =
          result &&
          result.reduce((acc: Array<any[]>, current: Array<any>) => {
            return [...acc, current[1]];
          }, []);
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve(value);
        }
      });
    });
  }

  async setMany(
    values: Array<{[key: string]: T}>,
    opts?: StorageOptions,
  ): Promise<void> {
    if (opts) {
      // noop
    }

    return new Promise<void>((resolve, reject) => {
      const valuesArray = values.map(entry => {
        return [Object.keys(entry)[0], entry];
      });
      this._asyncStorageNativeModule.multiSet([valuesArray], function(
        errors: Array<Error>,
      ) {
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve();
        }
      });
    });
  }

  async removeSingle(key: string, opts?: StorageOptions): Promise<void> {
    if (opts) {
      // noop
    }

    return new Promise<void>((resolve, reject) => {
      this._asyncStorageNativeModule.multiRemove([key], function(
        errors: Array<Error>,
      ) {
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve();
        }
      });
    });
  }

  async removeMany(keys: Array<string>, opts?: StorageOptions): Promise<void> {
    if (opts) {
      // noop
    }

    return new Promise<void>((resolve, reject) => {
      this._asyncStorageNativeModule.multiRemove(keys, function(
        errors: Array<Error>,
      ) {
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve();
        }
      });
    });
  }

  async getKeys(opts?: StorageOptions): Promise<Array<string>> {
    if (opts) {
      // noop
    }

    return new Promise<Array<string>>((resolve, reject) => {
      this._asyncStorageNativeModule.getAllKeys(function(
        errors: Array<Error>,
        keys: Array<string>,
      ) {
        const err = convertErrors(errors);

        if (err && err.length) {
          reject(err[0]);
        } else {
          resolve(keys);
        }
      });
    });
  }

  async dropStorage(opts?: StorageOptions): Promise<void> {
    if (opts) {
      // noop
    }

    return new Promise<void>((resolve, reject) => {
      this._asyncStorageNativeModule.clear(function(error: Array<Error>) {
        const err = convertErrors(Array.isArray(error) ? error : [error]);

        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
