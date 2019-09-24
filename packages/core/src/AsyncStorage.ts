/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {simpleErrorHandler, simpleLogger, noop} from './defaults';
import {createExtension} from './extension';
import {
  ExtensionType,
  FactoryOptions,
  IStorageBackend,
  LoggerAction,
  StorageOptions,
} from '../types';

class AsyncStorage<M, T extends IStorageBackend<M>> {
  readonly ext: ExtensionType<T>;

  private readonly _backend: T;
  private readonly _config: FactoryOptions;
  private readonly log: (action: LoggerAction) => void;
  private readonly error: (e: Error | string) => void;

  constructor(storageBackend: T, asOptions: FactoryOptions) {
    this._backend = storageBackend;
    this._config = asOptions;

    // off by default
    this.log = noop;
    this.error = noop;

    this.ext = createExtension<T>(this._backend);

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
  async get<K extends keyof M>(
    key: K,
    opts: StorageOptions = null,
  ): Promise<M[K] | null> {
    let value = null as M[K] | null;
    try {
      this.log({
        action: 'read-single',
        key: key as string,
      });
      value = await this._backend.getSingle(key, opts);
    } catch (e) {
      this.error(e);
    }

    return value;
  }

  async set<K extends keyof M>(
    key: K,
    value: M[K],
    opts: StorageOptions = null,
  ): Promise<void> {
    try {
      this.log({
        action: 'save-single',
        key: key as string,
        value,
      });
      await this._backend.setSingle(key, value, opts);
    } catch (e) {
      this.error(e);
    }
  }

  async getMultiple<K extends keyof M>(
    keys: Array<K>,
    opts: StorageOptions = null,
  ): Promise<{[k in K]: M[k] | null}> {
    let values = {} as {[k in K]: M[k] | null};

    try {
      this.log({
        action: 'read-many',
        key: keys as string[],
      });
      values = await this._backend.getMany(keys, opts);
    } catch (e) {
      this.error(e);
    }

    return values;
  }

  async setMultiple<K extends keyof M>(
    keyValues: Array<{[k in K]: M[k]}>,
    opts: StorageOptions = null,
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

  async remove(key: keyof M, opts: StorageOptions = null): Promise<void> {
    try {
      this.log({
        action: 'delete-single',
        key: key as string,
      });
      await this._backend.removeSingle(key, opts);
    } catch (e) {
      this.error(e);
    }
  }

  async removeMultiple(
    keys: Array<keyof M>,
    opts: StorageOptions = null,
  ): Promise<void> {
    try {
      this.log({
        action: 'delete-many',
        key: keys as string[],
      });
      await this._backend.removeMany(keys, opts);
    } catch (e) {
      this.error(e);
    }
  }

  async getKeys(opts: StorageOptions = null): Promise<Array<keyof M>> {
    let keys: Array<keyof M> = [];

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

  async clearStorage(opts: StorageOptions = null): Promise<void> {
    try {
      this.log({
        action: 'drop',
      });
      await this._backend.dropStorage(opts);
    } catch (e) {
      this.error(e);
    }
  }
}

export default AsyncStorage;
