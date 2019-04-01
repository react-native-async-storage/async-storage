/**
 * @format
 */

import AsyncStorage from './AsyncStorage';

type AsyncStorageHook = {
  getItem: (
    callback?: ?(error: ?Error, result: string | null) => void,
  ) => Promise<string | null>,
  setItem: (
    value: string,
    callback?: ?(error: ?Error) => void,
  ) => Promise<null>,
  mergeItem: (
    value: string,
    callback?: ?(error: ?Error) => void,
  ) => Promise<null>,
  removeItem: (callback?: ?(error: ?Error) => void) => Promise<null>,
};

export function useAsyncStorage(key: string): AsyncStorageHook {
  return {
    getItem: (...args) => AsyncStorage.getItem(key, ...args),
    setItem: (...args) => AsyncStorage.setItem(key, ...args),
    mergeItem: (...args) => AsyncStorage.mergeItem(key, ...args),
    removeItem: (...args) => AsyncStorage.removeItem(key, ...args),
  };
}
