/**
 * Expo managed apps don't include the @react-native-community/async-storage
 * native modules yet, but the API interface is the same, so we can use the version
 * exported from React Native still.
 *
 * If in future releases (eg: @react-native-community/async-storage >= 2.0.0) this
 * will likely not be valid anymore, and the package will need to be included in the Expo SDK
 * to continue to work.
 */
const {NativeModules} = require('react-native');
const RCTAsyncStorage = NativeModules.AsyncSQLiteDBStorage || NativeModules.AsyncLocalStorage;

export default RCTAsyncStorage;