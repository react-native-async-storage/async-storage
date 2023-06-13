// @ts-ignore Module '"react-native"' has no exported member 'TurboModuleRegistry'.
import { NativeModules, TurboModuleRegistry } from 'react-native';
import { shouldFallbackToLegacyNativeModule } from './shouldFallbackToLegacyNativeModule';

import AsyncStorageTurboModule from './NativeAsyncStorageModule';

let RCTAsyncStorage =
  AsyncStorageTurboModule ||
  NativeModules['PlatformLocalStorage'] || // Support for external modules, like react-native-windows
  NativeModules['RNCAsyncStorage'];

if (!RCTAsyncStorage && shouldFallbackToLegacyNativeModule()) {
  if (TurboModuleRegistry) {
    RCTAsyncStorage =
      TurboModuleRegistry.get('AsyncSQLiteDBStorage') ||
      TurboModuleRegistry.get('AsyncLocalStorage');
  } else {
    RCTAsyncStorage =
      NativeModules['AsyncSQLiteDBStorage'] ||
      NativeModules['AsyncLocalStorage'];
  }
}

export default RCTAsyncStorage;
