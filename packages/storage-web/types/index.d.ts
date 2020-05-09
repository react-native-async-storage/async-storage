/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { IStorageBackend, EmptyStorageModel } from '@react-native-community/async-storage';
declare type StorageType = 'idb' | 'local' | 'session';
declare class WebStorage<T extends EmptyStorageModel = EmptyStorageModel> implements IStorageBackend<T> {
    storage: {
        name: string;
        getItem: Function;
        setItem: Function;
        deleteItem: Function;
        keys: Function;
        clear: Function;
    };
    constructor(storageType?: StorageType);
    getSingle<K extends keyof T>(key: K): Promise<T[K] | null>;
    setSingle<K extends keyof T>(key: K, value: T[K]): Promise<void>;
    getMany<K extends keyof T>(keys: Array<K>): Promise<{
        [k in K]: T[k] | null;
    }>;
    setMany<K extends keyof T>(values: Array<Partial<{
        [k in K]: T[k];
    }>>): Promise<void>;
    removeSingle(key: keyof T): Promise<void>;
    removeMany(keys: Array<keyof T>): Promise<void>;
    getKeys(): Promise<Array<keyof T>>;
    dropStorage(): Promise<void>;
}
export default WebStorage;
