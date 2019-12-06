// CREDITS: This types are based on the original work made by all the people who contributed to @types/react-native

declare module '@react-native-community/async-storage' {
  /**
   * AsyncStorage is a simple, unencrypted, asynchronous, persistent, key-value storage
   * system that is global to the app.  It should be used instead of LocalStorage.
   *
   * It is recommended that you use an abstraction on top of `AsyncStorage`
   * instead of `AsyncStorage` directly for anything more than light usage since
   * it operates globally.
   *
   * On iOS, `AsyncStorage` is backed by native code that stores small values in a
   * serialized dictionary and larger values in separate files. On Android,
   * `AsyncStorage` will use either [RocksDB](http://rocksdb.org/) or SQLite
   * based on what is available.
   *
   * @see https://github.com/react-native-community/react-native-async-storage/blob/master/docs/API.md
   */
  export interface AsyncStorageStatic {
    /**
     * Fetches key and passes the result to callback, along with an Error if there is any.
     */
    getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null>;

    /**
     * Sets value for key and calls callback on completion, along with an Error if there is any
     */
    setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;

    removeItem(key: string, callback?: (error?: Error) => void): Promise<void>;

    /**
     * Merges existing value with input value, assuming they are stringified json. Returns a Promise object.
     * Not supported by all native implementation
     */
    mergeItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;

    /**
     * Erases all AsyncStorage for all clients, libraries, etc. You probably don't want to call this.
     * Use removeItem or multiRemove to clear only your own keys instead.
     */
    clear(callback?: (error?: Error) => void): Promise<void>;

    /**
     * Gets all keys known to the app, for all callers, libraries, etc
     */
    getAllKeys(callback?: (error?: Error, keys?: string[]) => void): Promise<string[]>;

    /**
     * multiGet invokes callback with an array of key-value pair arrays that matches the input format of multiSet
     */
    multiGet(
      keys: string[],
      callback?: (errors?: Error[], result?: [string, string | null][]) => void
    ): Promise<[string, string | null][]>;

    /**
     * multiSet and multiMerge take arrays of key-value array pairs that match the output of multiGet,
     *
     * multiSet([['k1', 'val1'], ['k2', 'val2']], cb);
     */
    multiSet(keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void>;

    /**
     * Delete all the keys in the keys array.
     */
    multiRemove(keys: string[], callback?: (errors?: Error[]) => void): Promise<void>;

    /**
     * Merges existing values with input values, assuming they are stringified json.
     * Returns a Promise object.
     *
     * Not supported by all native implementations.
     */
    multiMerge(keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void>;
  }

  export function useAsyncStorage(key: string): {
    getItem(callback?: (error?: Error, result?: string) => void): Promise<string | null>;
    setItem(value: string, callback?: (error?: Error) => void): Promise<void>;
    mergeItem(value: string, callback?: (error?: Error) => void): Promise<void>;
    removeItem(callback?: (error?: Error) => void): Promise<void>;
  }

  const AsyncStorage: AsyncStorageStatic;

  export default AsyncStorage;
}

declare module '@react-native-community/async-storage/jest/async-storage-mock' {
  type KeysType = Array<string>;
  type KeyValueType = Array<Array<string>>;
  type CallbackType = ((error?: Error) => void) | void;
  type ItemGetCallbackType = ((error?: Error, def?: string) => void) | void;
  type ResultCallbackType = ((error?: Error, keyValueType?: KeyValueType) => void) | void;

  export interface AsyncStorageMockStatic {
    setItem(key: string, value: string, callback: CallbackType): Promise<null>;
    getItem(key: string, callback: ItemGetCallbackType): Promise<string>;
    removeItem(key: string, callback: CallbackType): Promise<null>;
    mergeItem(key: string, value: string, callback: CallbackType): Promise<null>;
    clear(callback: CallbackType): Promise<null>;
    getAllKeys(): Promise<Array<string>>;
    flushGetRequests(): void;
    multiGet(keys: KeysType, callback: ResultCallbackType): Promise<Array<string>>;
    multiSet(keyValuePairs: KeyValueType, callback: CallbackType): Promise<null>;
    multiRemove(keys: KeysType, callback: CallbackType): Promise<null>;
    multiMerge(keyValuePairs: KeyValueType, callback: CallbackType): Promise<null>;
  }

  const AsyncStorageMock: AsyncStorageMockStatic;

  export default AsyncStorageMock;
}
