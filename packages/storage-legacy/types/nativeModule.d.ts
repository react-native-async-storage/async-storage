/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface ILegacyNativeModule {
  multiGet(
    keys: Array<any>,
    callback: (errors: Array<Error>, result: Array<[any, any]>) => void,
  ): void;

  multiSet(
    values: Array<Array<any>>,
    callback: (errors: Array<Error>) => void,
  ): void;

  multiRemove(keys: Array<any>, callback: (errors: Array<Error>) => void): void;

  getAllKeys(callback: (errors: Array<Error>, keys: Array<any>) => void): void;

  clear(callback: (errors: Array<Error>) => void): void;
}
