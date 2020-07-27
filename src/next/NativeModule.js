/**
 * Copyright (c) Krzysztof Borowy
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {NativeModules} from 'react-native';

export type KeyType = String;
export type ValueType = String | null;
export type EntryType = {[key: KeyType]: ValueType};

type ASNativeModuleType = {
  getSingle: (key: KeyType) => Promise<ValueType>,
  setSingle: (key: KeyType, value: ValueType) => Promise<boolean>,
  deleteSingle: (key: KeyType) => Promise<boolean>,

  getMany: (keys: KeyType[]) => Promise<EntryType>,
  setMany: (EntryType) => Promise<boolean>,
  deleteMany: (keys: KeyType[]) => Promise<boolean>,

  getAllKeys: () => Promise<KeyType[]>,
  dropDatabase: () => Promise<boolean>
}

const ASNative: ASNativeModuleType = NativeModules.RNC_AsyncStorageNext;

if (!ASNative) {
  /**
   * Native Module is not linked properly
   * We need to notify dev about it
   */
  throw new Error('AsyncStorage\'s NativeModule is not linked.');
}

export default ASNative;
