import React from 'react';
import AsyncStorage from './AsyncStorage';

export function useAsyncStorage(key: string) {
  const getItem = React.useCallback(
    (...args) => AsyncStorage.getItem(key, ...args),
    [key]
  );

  const setItem = React.useCallback(
    //@ts-ignore
    (...args) => AsyncStorage.setItem(key, ...args),
    [key]
  );

  const mergeItem = React.useCallback(
    (...args) =>
      //@ts-ignore
      AsyncStorage.mergeItem?.(key, ...args) ??
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
