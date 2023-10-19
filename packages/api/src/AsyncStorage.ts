import { StorageKeys, StorageModel } from "./StorageModel";
import { StorageExtension } from "./StorageExtension";

/**
 * AsyncStorage Interface
 * Provides methods for managing asynchronous storage operations.
 * @typeParam S - type of the storage model.
 * @typeParam E - type of the storage extension, or unknown, if no extension is provided.
 */
export interface AsyncStorage<
  S extends StorageModel,
  E extends StorageExtension | unknown = unknown
> {
  /**
   * Retrieves a single item from storage based on the provided key.
   * @param key - The key to identify the item within the storage.
   * @returns Promise resolving to the value associated with the key,
   *          or null if the key does not exist.
   */
  getItem<K extends StorageKeys<S>>(key: K): Promise<S[K]>;

  /**
   * Sets the value of the specified item in the storage.
   * @param key - The key under which the value should be stored.
   * @param value - The value to be stored.
   * @returns Promise that resolves when the operation is completed.
   */
  setItem<K extends StorageKeys<S>>(key: K, value: S[K]): Promise<void>;

  /**
   * Removes the item from storage identified by the provided key.
   * @param key - The key of the item to be removed.
   * @returns Promise that resolves when the operation is completed.
   */
  removeItem<K extends StorageKeys<S>>(key: K): Promise<void>;

  /**
   * Retrieves multiple items from storage based on the provided keys.
   * @param keys - An array of keys to identify the items to be retrieved.
   * @returns Promise resolving to an object with key-value pairs,
   *          where the values are associated with the keys,
   *          or null if a key does not exist.
   */
  getMany<K extends StorageKeys<S>>(keys: K[]): Promise<{ [k in K]: S[k] }>;

  /**
   * Sets multiple items in the storage.
   * @param entries - An object containing key-value pairs to be stored.
   * @returns Promise that resolves when the operation is completed.
   */
  setMany<K extends StorageKeys<S>>(entries: {
    [k in K]: S[k];
  }): Promise<void>;

  /**
   * Removes multiple items from storage based on the provided keys.
   * @param keys - An array of keys identifying the items to be removed.
   * @returns Promise that resolves when the operation is completed.
   */
  removeMany<K extends StorageKeys<S>>(keys: K[]): Promise<void>;

  /**
   * Clears all the data from the storage.
   * @returns Promise that resolves when the operation is completed.
   */
  clear(): Promise<void>;

  /**
   * Represents the extension for providing additional functionality
   * beyond the standard storage interface.
   * See {@link StorageExtension} for more details.
   */
  ext: E;
}
