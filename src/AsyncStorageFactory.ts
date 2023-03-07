import type { StorageBackend } from './types';

class Storage<Extensions> {
  constructor(private backend: StorageBackend<Extensions>) {}

  // TODO: This prop should only show up when `Extensions` is defined.
  get extensions(): Extensions {
    // @ts-expect-error property 'extensions' does not exist on type 'StorageBackendBase'
    return this.backend.extensions;
  }

  getItem(key: string): Promise<string | null>;
  getItem(key: string, callback: (value: string | null) => void): void;
  getItem(
    key: string,
    callback?: (value: string | null) => void
  ): Promise<string | null> | void {
    if (!callback) {
      return new Promise((resolve) => {
        this.backend.multiGet([key], (result) => {
          resolve(result[key]);
        });
      });
    }

    this.backend.multiGet([key], (result) => {
      callback(result[key]);
    });
  }

  removeItem(key: string): Promise<void>;
  removeItem(key: string, callback: () => void): void;
  removeItem(key: string, callback?: () => void): Promise<void> | void {
    if (!callback) {
      return new Promise((resolve) => {
        this.backend.multiRemove([key], resolve);
      });
    }

    this.backend.multiRemove([key], callback);
  }

  setItem(key: string, value: string): Promise<void>;
  setItem(key: string, value: string, callback: () => void): void;
  setItem(
    key: string,
    value: string,
    callback?: () => void
  ): Promise<void> | void {
    const values = { [key]: value };
    if (!callback) {
      return new Promise((resolve) => {
        this.backend.multiSet(values, resolve);
      });
    }

    this.backend.multiSet(values, callback);
  }

  getMany(keys: readonly string[]): Promise<Record<string, string | null>>;
  getMany(
    keys: readonly string[],
    callback: (result: Record<string, string | null>) => void
  ): void;
  getMany(
    keys: readonly string[],
    callback?: (result: Record<string, string | null>) => void
  ): Promise<Record<string, string | null>> | void {
    if (!callback) {
      return new Promise((resolve) => {
        this.backend.multiGet(keys, resolve);
      });
    }

    this.backend.multiGet(keys, callback);
  }

  setMany(values: Record<string, string>): Promise<void>;
  setMany(values: Record<string, string>, callback: () => void): void;
  setMany(
    values: Record<string, string>,
    callback?: () => void
  ): Promise<void> | void {
    if (!callback) {
      return new Promise((resolve) => {
        this.backend.multiSet(values, resolve);
      });
    }

    this.backend.multiSet(values, callback);
  }

  removeMany(keys: readonly string[]): Promise<void>;
  removeMany(keys: readonly string[], callback: () => void): void;
  removeMany(
    keys: readonly string[],
    callback?: () => void
  ): Promise<void> | void {
    if (!callback) {
      return new Promise((resolve) => {
        this.backend.multiRemove(keys, resolve);
      });
    }

    this.backend.multiRemove(keys, callback);
  }

  clear(): Promise<void>;
  clear(callback: () => void): void;
  clear(callback?: () => void): Promise<void> | void {
    if (!callback) {
      return new Promise((resolve) => {
        this.backend.drop(resolve);
      });
    }

    this.backend.drop(callback);
  }
}

export type { Storage };

export class AsyncStorageFactory {
  static create<E>(backend: StorageBackend<E>): Storage<E> {
    return new Storage(backend);
  }
}
