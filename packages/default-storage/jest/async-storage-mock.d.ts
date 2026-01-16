import type {
  AsyncStorageHook,
  AsyncStorageObjectHook,
  AsyncStorageStatic,
} from "../lib/typescript/types";

export function useAsyncStorage(key: string): AsyncStorageHook;
export function useAsyncStorageObject<T>(key: string): AsyncStorageObjectHook<T>;

declare const AsyncStorage: AsyncStorageStatic;
export default AsyncStorage;
