/**
 * Expo managed apps don't include the @react-native-community/async-storage
 * native modules yet, but the API interface is the same, so we can use the version
 * exported from React Native still.
 *
 * If in future releases (eg: @react-native-community/async-storage >= 2.0.0) this
 * will likely not be valid anymore, and the package will need to be included in the Expo SDK
 * to continue to work.
 */
const {NativeModules, TurboModuleRegistry} = require('react-native');

let RCTAsyncStorage;

// TurboModuleRegistry falls back to NativeModules
// so we don't have to try go assign NativeModules'
// counterparts if TurboModuleRegistry would resolve
// with undefined.
if (TurboModuleRegistry) {
  RCTAsyncStorage = TurboModuleRegistry.get("AsyncSQLiteDBStorage") || TurboModuleRegistry.get("AsyncLocalStorage");
} else {
  RCTAsyncStorage = NativeModules.AsyncSQLiteDBStorage || NativeModules.AsyncLocalStorage;
}

export default RCTAsyncStorage;
