import { useMemo } from 'react';

import AsyncStorage from './AsyncStorage';

import type { AsyncStorageHook, Callback, CallbackWithResult } from './types';

export function useAsyncStorage(key: string): AsyncStorageHook {
  const asyncStorage = useMemo(() => ({
    getItem: (callback?: CallbackWithResult<string>) => AsyncStorage.getItem(key, callback),
    setItem: (value: string, callback?: Callback) => AsyncStorage.setItem(key, value, callback),
    mergeItem: (value: string, callback?: Callback) => AsyncStorage.mergeItem(key, value, callback),
    removeItem: (callback?: Callback) => AsyncStorage.removeItem(key, callback),
  }), [key]);
  
  return asyncStorage;
}
