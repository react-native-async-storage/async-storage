export { AsyncStorage } from './AsyncStorage.native';
export { AsyncStorageFactory } from './AsyncStorageFactory';
export type { AsyncStorageStatic } from './legacy/types';
export type { StorageBackend } from './types';

import LegacyAsyncStorage from './legacy/AsyncStorage';
export default LegacyAsyncStorage;
