export type StorageModel<T = unknown> = {
  [K in keyof T]: T[K];
};

export type StorageKeys<T> = keyof T;

export type StorageEntry = Record<string, string | null>;

export type DefaultStorageModel = StorageModel<{ [key in string]: string }>;
