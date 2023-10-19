/**
 * A type used to define the structure and shape of the data to be stored.
 */
export type StorageModel<
  T extends Record<string, unknown> | unknown = unknown
> = {
  [K in keyof T]: NonNullable<T[K]> | null;
};

/**
 * A utility type to extract key.
 */
export type StorageKeys<T> = keyof T;
