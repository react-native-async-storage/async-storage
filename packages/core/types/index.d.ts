/**
 *
 * Core Async Storage API
 *
 */
declare class AsyncStorage<
  STR extends IStorageBackend,
  VAL = StorageModelType<STR>
> {
  get(key: string, opts?: StorageOptions): Promise<VAL | null>;

  set(key: string, value: VAL, opts?: StorageOptions): Promise<void>;

  getMultiple(
    keys: Array<string>,
    opts?: StorageOptions,
  ): Promise<Array<VAL | null>>;

  setMultiple(
    keyValues: Array<{[key: string]: VAL}>,
    opts?: StorageOptions,
  ): Promise<void>;

  remove(key: string, opts?: StorageOptions): Promise<void>;

  removeMultiple(keys: Array<string>, opts?: StorageOptions): Promise<void>;

  getKeys(opts?: StorageOptions): Promise<Array<string>>;

  clearStorage(opts?: StorageOptions): Promise<void>;

  instance(): STR;
}

/**
 *
 * Storage Backend API
 *
 */
declare interface IStorageBackend<VAL = any> {
  getSingle(key: string, opts?: StorageOptions): Promise<VAL | null>;

  setSingle(key: string, value: VAL, opts?: StorageOptions): Promise<void>;

  getMany(
    keys: Array<string>,
    opts?: StorageOptions,
  ): Promise<Array<VAL | null>>;

  setMany(
    values: Array<{[key: string]: VAL}>,
    opts?: StorageOptions,
  ): Promise<void>;

  removeSingle(key: string, opts?: StorageOptions): Promise<void>;

  removeMany(keys: Array<string>, opts?: StorageOptions): Promise<void>;

  getKeys(opts?: StorageOptions): Promise<Array<string>>;

  dropStorage(opts?: StorageOptions): Promise<void>;
}

/**
 *
 * Factory types
 *
 */
declare class AsyncStorageFactory {
  static create<STR extends IStorageBackend>(
    storage: STR,
    opts: FactoryOptions,
  ): AsyncStorage<STR, StorageModelType<STR>>;
}

// infers Model type from Storage instance
type StorageModelType<T> = T extends IStorageBackend<infer V> ? V : any;

// Options provided to the factory
declare type FactoryOptions = {
  logger: ((action: LoggerAction) => void) | boolean | void;
  errorHandler: ((error: Error | string) => void) | boolean | void;
};

/**
 *
 * Global types
 *
 */
declare type LoggerAction = {
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

declare type StorageOptions = {
  [key: string]: any;
} | null;
