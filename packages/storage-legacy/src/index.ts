/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {NativeModules} from 'react-native';
import {
  EmptyStorageModel,
  IStorageBackend,
  StorageOptions,
} from '@react-native-community/async-storage';
import {ILegacyNativeModule} from '../types/nativeModule';

function convertErrors(errs?: Array<Error> | Error) {
  if (!errs) {
    return null;
  }
  return Array.isArray(errs) ? errs.filter(e => !!e) : [errs];
}

function checkValidInput(usedKey: any, value?: any) {
  const isValuePassed = arguments.length > 1;

  if (typeof usedKey !== 'string') {
    console.warn(
      `[AsyncStorageLegacy] Using "${typeof usedKey}" type for key is not supported. This can lead to unexpected behavior/errors. Use string instead.\nKey passed: ${usedKey}\n`,
    );
  }

  if (isValuePassed && typeof value !== 'string') {
    if (value == null) {
      throw new Error(
        `[AsyncStorageLegacy] Passing "null" or "undefined" as value is not supported. If you need to remove a value, use ".removeSingle" method instead.\nUsed key: ${usedKey}\n`,
      );
    } else {
      console.warn(
        `[AsyncStorageLegacy] The value for key "${usedKey}" is not a string. This can lead to unexpected behavior/errors. Consider stringifying it.\nPassed value: ${value}\nPassed key: ${usedKey}\n`,
      );
    }
  }
}

export default class LegacyAsyncStorage<
  T extends EmptyStorageModel = EmptyStorageModel
> implements IStorageBackend<T> {
  private readonly _asyncStorageNativeModule: ILegacyNativeModule;

  constructor() {
    this._asyncStorageNativeModule =
      NativeModules.RNC_AsyncSQLiteDBStorage || NativeModules.RNCAsyncStorage;

    if (!this._asyncStorageNativeModule) {
      throw new Error(
        '[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.',
      );
    }
  }

  async getSingle<K extends keyof T>(
    key: K,
    _?: StorageOptions,
  ): Promise<T[K] | null> {
    checkValidInput(key);

    return new Promise((resolve, reject) => {
      this._asyncStorageNativeModule.multiGet([key], function(
        errors: Array<Error>,
        result: Array<[any, T[K] | null]>,
      ) {
        const value = (result && result[0] && result[0][1]) || null;
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve(value);
        }
      });
    });
  }

  async setSingle<K extends keyof T>(
    key: K,
    value: T[K],
    _?: StorageOptions,
  ): Promise<void> {
    checkValidInput(key, value);

    return new Promise((resolve, reject) => {
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

  async getMany<K extends keyof T>(
    keys: Array<K>,
    _?: StorageOptions,
  ): Promise<{[k in K]: T[k] | null}> {
    keys.forEach(k => checkValidInput(k));

    return new Promise((resolve, reject) => {
      this._asyncStorageNativeModule.multiGet(keys, function(
        errors: Array<Error>,
        result: Array<[K, T[K]]>,
      ) {
        const value: {[k in K]: T[k]} = result.reduce<any>(
          (acc, current: [K, T[K]]) => {
            const key = current[0];
            const val = current[1];
            return {
              ...acc,
              [key]: val,
            };
          },
          {},
        );
        const errs = convertErrors(errors);
        if (errs && errs.length) {
          reject(errs[0]);
        } else {
          resolve(value);
        }
      });
    });
  }

  async setMany<K extends keyof T>(
    values: Array<Partial<{[k in K]: T[k]}>>,
    _?: StorageOptions,
  ): Promise<void> {
    values.forEach(keyValue => {
      (Object.keys(keyValue) as Array<K>).forEach(key => {
        checkValidInput(key, keyValue[key]);
      });
    });

    return new Promise((resolve, reject) => {
      const valuesArray = values.map(entry => {
        const key = Object.keys(entry)[0] as K;
        const value = entry[key];

        return [key, value];
      });
      this._asyncStorageNativeModule.multiSet(valuesArray, function(
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

  async removeSingle(key: keyof T, _?: StorageOptions): Promise<void> {
    checkValidInput(key);

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

  async removeMany(keys: Array<keyof T>, _?: StorageOptions): Promise<void> {
    keys.forEach(k => checkValidInput(k));

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

  async getKeys(_?: StorageOptions): Promise<Array<keyof T>> {
    return new Promise((resolve, reject) => {
      this._asyncStorageNativeModule.getAllKeys(function(
        errors: Array<Error>,
        keys: Array<keyof T>,
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

  async dropStorage(_?: StorageOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._asyncStorageNativeModule.clear(function(
        error: Array<Error> | Error,
      ) {
        const err = convertErrors(error);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
