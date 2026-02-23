// note: .js extensions are kept to support react native web
import { getLegacyStorage } from "./createAsyncStorage.js";

export type { AsyncStorage } from "./AsyncStorage";
export { createAsyncStorage } from "./createAsyncStorage.js";

export { AsyncStorageError } from "./AsyncStorageError";

// Legacy storage that is proxy to an old storage data.
export default getLegacyStorage();
