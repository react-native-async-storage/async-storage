import React from 'react';
import AsyncStorage from './AsyncStorage';

export function useAsyncStorage(key: string) {
  const getItem = React.useCallback(
    (...args) => AsyncStorage.getItem(key, ...args),
    [key]
  );

  const setItem = React.useCallback(
    (...args: any[]) => AsyncStorage.setItem(key, args[0], args[1]),
    [key]
  );

  const mergeItem = React.useCallback(
    (...args) =>
      AsyncStorage.mergeItem?.(key, args[0], args[1]) ??
      Promise.reject('Not implemented'),
    [key]
  );

  const removeItem = React.useCallback(
    (...args) => AsyncStorage.removeItem(key, ...args),
    [key]
  );

  return {
    getItem,
    setItem,
    mergeItem,
    removeItem,
  };
}
