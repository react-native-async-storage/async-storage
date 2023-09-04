import { StorageModel } from "./StorageModel";
import { StorageAdapter } from "./StorageAdapter";

export type StorageConfig<S extends StorageModel> = {
  adapter: StorageAdapter<S>;
};
