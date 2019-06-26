import {simpleErrorHandler, simpleLogger, noop} from './defaults';

class AsyncStorage<STR extends IStorageBackend, VAL = StorageModelType<STR>> {
  private readonly _backend: STR;
  private readonly _config: FactoryOptions;
  private readonly log: (action: LoggerAction) => void;
  private readonly error: (e: Error | string) => void;

  constructor(storageBackend: STR, asOptions: FactoryOptions) {
    this._backend = storageBackend;
    this._config = asOptions;

    // off by default
    this.log = noop;
    this.error = noop;

    if (this._config.logger) {
      this.log =
        typeof this._config.logger === 'function'
          ? this._config.logger
          : simpleLogger;
    }

    if (this._config.errorHandler) {
      this.error =
        typeof this._config.errorHandler === 'function'
          ? this._config.errorHandler
          : simpleErrorHandler;
    }
  }

  async get(key: string, opts?: StorageOptions): Promise<VAL | null> {
    let value = null;
    try {
      this.log({
        action: 'read-single',
        key: key,
      });
      value = await this._backend.getSingle(key, opts);
    } catch (e) {
      this.error(e);
    }

    return value;
  }

  async set(key: string, value: VAL, opts?: StorageOptions): Promise<void> {
    try {
      this.log({
        action: 'save-single',
        key,
        value,
      });
      await this._backend.setSingle(key, value, opts);
    } catch (e) {
      this.error(e);
    }
  }

  async getMultiple(
    keys: Array<string>,
    opts?: StorageOptions,
  ): Promise<Array<VAL | null>> {
    let values: Array<VAL | null> = [];

    try {
      this.log({
        action: 'read-many',
        key: keys,
      });
      values = await this._backend.getMany(keys, opts);
    } catch (e) {
      this.error(e);
    }

    return values;
  }

  async setMultiple(
    keyValues: Array<{[key: string]: VAL}>,
    opts?: StorageOptions,
  ): Promise<void> {
    try {
      this.log({
        action: 'save-many',
        value: keyValues,
      });
      await this._backend.setMany(keyValues, opts);
    } catch (e) {
      this.error(e);
    }
  }

  async remove(key: string, opts?: StorageOptions): Promise<void> {
    try {
      this.log({
        action: 'delete-single',
        key,
      });
      await this._backend.removeSingle(key, opts);
    } catch (e) {
      this.error(e);
    }
  }

  async removeMultiple(
    keys: Array<string>,
    opts?: StorageOptions,
  ): Promise<void> {
    try {
      this.log({
        action: 'delete-many',
        key: keys,
      });
      await this._backend.removeMany(keys, opts);
    } catch (e) {
      this.error(e);
    }
  }

  async getKeys(opts?: StorageOptions): Promise<Array<string>> {
    let keys: Array<string> = [];

    try {
      this.log({
        action: 'keys',
      });
      keys = await this._backend.getKeys(opts);
    } catch (e) {
      this.error(e);
    }

    return keys;
  }

  async clearStorage(opts?: StorageOptions): Promise<void> {
    try {
      this.log({
        action: 'drop',
      });
      await this._backend.dropStorage(opts);
    } catch (e) {
      this.error(e);
    }
  }

  instance(): STR {
    return this._backend;
  }
}

export default AsyncStorage;
