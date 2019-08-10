export class AsyncStorage<
  STR extends IStorageBackend,
  VAL = StorageModel<STR>
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

export default class AsyncStorageFactory {
  static create<STR extends IStorageBackend>(
    storage: STR,
    opts: FactoryOptions,
  ): AsyncStorage<STR, StorageModel<STR>>;
}

export interface IStorageBackend<VAL = any> {
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

export type StorageModel<T> = T extends IStorageBackend<infer V> ? V : any;

export type StorageOptions = {
  [key: string]: any;
} | null;
