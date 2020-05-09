/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { EmptyStorageModel, IStorageBackend, StorageOptions } from '@react-native-community/async-storage';
export default class LegacyAsyncStorage<T extends EmptyStorageModel = EmptyStorageModel> implements IStorageBackend<T> {
    private readonly _asyncStorageNativeModule;
    constructor();
    getSingle<K extends keyof T>(key: K, _?: StorageOptions): Promise<T[K] | null>;
    setSingle<K extends keyof T>(key: K, value: T[K], _?: StorageOptions): Promise<void>;
    getMany<K extends keyof T>(keys: Array<K>, _?: StorageOptions): Promise<{
        [k in K]: T[k] | null;
    }>;
    setMany<K extends keyof T>(values: Array<Partial<{
        [k in K]: T[k];
    }>>, _?: StorageOptions): Promise<void>;
    removeSingle(key: keyof T, _?: StorageOptions): Promise<void>;
    removeMany(keys: Array<keyof T>, _?: StorageOptions): Promise<void>;
    getKeys(_?: StorageOptions): Promise<Array<keyof T>>;
    dropStorage(_?: StorageOptions): Promise<void>;
}
