export type ErrorLike = {
  message: string;
  key: string;
};

export type StorageBackendBase = {
  multiGet(
    keys: readonly string[],
    callback: (result: Record<string, string | null>) => void
  ): void;
  multiSet(values: Record<string, string>, callback: () => void): void;
  multiRemove(strings: readonly string[], callback: () => void): void;

  drop(callback: () => void): void;
};

export type StorageBackend<Extensions = never> = Extensions extends Record<
  string,
  unknown
>
  ? StorageBackendBase & { extensions: Extensions }
  : StorageBackendBase;
