import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { shouldFallbackToLegacyNativeModule } from './shouldFallbackToLegacyNativeModule';
import type { ErrorLike } from './types';

export interface Spec extends TurboModule {
  clear(callback: (error?: ErrorLike) => void): void;

  getAllKeys(callback: (error?: ErrorLike, keys?: string[]) => void): void;

  multiGet(
    keys: readonly string[],
    callback: (errors?: ErrorLike[], result?: [string, string | null][]) => void
  ): void;

  multiMerge: (
    keyValuePairs: readonly [string, string][],
    callback: (errors?: ErrorLike[]) => void
  ) => Promise<void>;

  multiRemove(
    strings: readonly string[],
    callback: (errors?: ErrorLike[]) => void
  ): void;

  multiSet(
    keyValuePairs: readonly [string, string][],
    callback: (errors?: ErrorLike[]) => void
  ): void;
}

function getModule(): Spec {
  const nativeModuleNames = [
    'PlatformLocalStorage', // Support for external modules, like react-native-windows
    'RNC_AsyncSQLiteDBStorage',
    'RNCAsyncStorage',
  ];

  if (shouldFallbackToLegacyNativeModule()) {
    nativeModuleNames.push('AsyncSQLiteDBStorage', 'AsyncLocalStorage');
  }

  for (const name of nativeModuleNames) {
    const impl = TurboModuleRegistry.get<Spec>(name);
    if (impl) {
      return impl;
    }
  }

  throw new Error(`[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.

To fix this issue try these steps:

  • Rebuild and restart the app.

  • Run the packager with \`--reset-cache\` flag.

  • If you are using CocoaPods on iOS, run \`pod install\` in the \`ios\` directory and then rebuild and re-run the app.

  • If this happens while testing with Jest, check out docs how to integrate AsyncStorage with it: https://react-native-async-storage.github.io/async-storage/docs/advanced/jest

If none of these fix the issue, please open an issue on the Github repository: https://github.com/react-native-async-storage/async-storage/issues
`);
}

export default getModule();
