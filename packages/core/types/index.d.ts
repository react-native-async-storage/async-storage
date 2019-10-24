/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Crates an Async Storage instance for given storage backend
 * Enhanced by Factory Options, to, in example, enable logging
 */
export default class AsyncStorageFactory {
  static create<M = EmptyStorageModel>(
    storage: IStorageBackend,
    opts: FactoryOptions,
  ): AsyncStorage<M, IStorageBackend<M>>;
}

/**
 * Do not instantiate. Create through AsyncStorageFactory.
 * Main API that will be used to call underlying storage backend
 */
export class AsyncStorage<M, T extends IStorageBackend<M>> {
  get<K extends keyof M>(key: K, opts?: StorageOptions): Promise<M[K] | null>;

  set<K extends keyof M>(
    key: K,
    value: M[K],
    opts?: StorageOptions,
  ): Promise<void>;

  getMultiple<K extends keyof M>(
    keys: Array<K>,
    opts?: StorageOptions,
  ): Promise<{[k in K]: M[k] | null}>;

  setMultiple<K extends keyof M>(
    keyValues: Array<Partial<{[k in keyof M]: M[k]}>>,
    opts?: StorageOptions,
  ): Promise<void>;

  remove(key: keyof M, opts?: StorageOptions): Promise<void>;

  removeMultiple(keys: Array<keyof M>, opts?: StorageOptions): Promise<void>;

  getKeys(opts?: StorageOptions): Promise<Array<keyof M>>;

  clearStorage(opts?: StorageOptions): Promise<void>;

  ext: ExtensionType<T>;
}

/**
 * Interface that must be implemented by any Storage Backend
 * Provides basic API for reading/writing and deleting of data
 */
export interface IStorageBackend<T = EmptyStorageModel> {
  getSingle<K extends keyof T>(
    key: K,
    opts?: StorageOptions,
  ): Promise<T[K] | null>;

  setSingle<K extends keyof T>(
    key: K,
    value: T[K],
    opts?: StorageOptions,
  ): Promise<void>;

  getMany<K extends keyof T>(
    keys: Array<K>,
    opts?: StorageOptions,
  ): Promise<{[k in K]: T[k] | null}>;

  setMany<K extends keyof T>(
    values: Array<{[k in K]: T[k]}>,
    opts?: StorageOptions,
  ): Promise<void>;

  removeSingle(key: keyof T, opts?: StorageOptions): Promise<void>;

  removeMany(keys: Array<keyof T>, opts?: StorageOptions): Promise<void>;

  getKeys(opts?: StorageOptions): Promise<Array<keyof T>>;

  dropStorage(opts?: StorageOptions): Promise<void>;
}

/**
 * Used by Factory to enhance calls
 */
export type FactoryOptions = {
  logger?: ((action: LoggerAction) => void) | boolean;
  errorHandler?: ((error: Error | string) => void) | boolean;
};

export type LoggerAction = {
  action:
    | 'read-single'
    | 'save-single'
    | 'delete-single'
    | 'read-many'
    | 'save-many'
    | 'delete-many'
    | 'drop'
    | 'keys';

  value?: any;
  key?: string | Array<string>;
};

// Helper types
export type EmptyStorageModel = {[key in symbol | number | string]: any};

export type StorageOptions = {
  [key: string]: any;
} | null;

export type ExtensionType<T> = Omit<T, keyof IStorageBackend>;
