/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {NativeModules} from 'react-native';

const AsyncStorageNativeModule =
  NativeModules.RNC_AsyncSQLiteDBStorage ||
  NativeModules.RNCAsyncStorage ||
  NativeModules.PlatformLocalStorage; // Support for external modules, like react-native-windows

if (!AsyncStorageNativeModule) {
  throw new Error('[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.');
}

function convertErrors(errs?: Array<Error> | Error) {
  if (!errs) {
    return null;
  }
  return Array.isArray(errs) ? errs.filter(e => !!e) : [errs];
}

export default {
  getItem: async (key: string) => {
    AsyncStorageNativeModule.multiGet([key], function(
      errors: Array<Error>,
      result: any,
    ) {
      const value = result && result[0] && result[0][1] ? result[0][1] : null;
      const errs = convertErrors(errors);
      if (errs) {
        throw errs[0];
      } else {
        return value;
      }
    });
  },

  setItem: async (key: string, value: any) => {
    AsyncStorageNativeModule.multiSet([[key, value]], function(
      errors: Array<Error>,
    ) {
      const errs = convertErrors(errors);
      if (errs) {
        throw errs[0];
      } else {
        return null;
      }
    });
  },

  removeItem: async (key: string) => {
    AsyncStorageNativeModule.multiRemove([key], function(errors: Array<Error>) {
      const errs = convertErrors(errors);
      if (errs) {
        throw errs[0];
      } else {
        return null;
      }
    });
  },

  getMultipleItems: async (keys: Array<string>) => {
    AsyncStorageNativeModule.multiGet(keys, function(
      errors: Array<Error>,
      result: any,
    ) {
      const value =
        result &&
        result.reduce((acc: Array<any[]>, current: Array<any>) => {
          return [...acc, current[1]];
        }, []);
      const errs = convertErrors(errors);
      if (errs) {
        throw errs[0];
      } else {
        return value;
      }
    });
  },

  setMultipleItems: async (keyValues: Array<{[key: string]: any}>) => {
    const keyValuesArray = keyValues.map(entry => {
      return [Object.keys(entry)[0], entry];
    });
    AsyncStorageNativeModule.multiSet([keyValuesArray], function(
      errors: Array<Error>,
    ) {
      const errs = convertErrors(errors);
      if (errs && errs.length) {
        throw errs[0];
      } else {
        return null;
      }
    });
  },

  removeMultipleItems: async (keys: Array<string>) => {
    AsyncStorageNativeModule.multiRemove(keys, function(errors: Array<Error>) {
      const errs = convertErrors(errors);
      if (errs && errs.length) {
        throw errs[0];
      } else {
        return null;
      }
    });
  },

  getAllKeys: async () => {
    AsyncStorageNativeModule.getAllKeys(function(
      errors: Array<Error>,
      keys: Array<String>,
    ) {
      const err = convertErrors(errors);

      if (err && err.length) {
        // we throw first error we have
        throw err[0];
      } else {
        return keys;
      }
    });
  },

  removeStorage: async () => {
    AsyncStorageNativeModule.clear(function(error: Array<Error>) {
      const err = convertErrors(Array.isArray(error) ? error : [error]);

      if (err) {
        throw err;
      } else {
        return null;
      }
    });
  },
};
