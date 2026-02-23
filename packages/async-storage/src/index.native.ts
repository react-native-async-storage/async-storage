import { getLegacyStorage } from "./createAsyncStorage";

export type { AsyncStorage } from "./AsyncStorage";
export { createAsyncStorage } from "./createAsyncStorage";

export { AsyncStorageError } from "./AsyncStorageError";

// Legacy storage that is proxy to an old storage data.
export default getLegacyStorage();
