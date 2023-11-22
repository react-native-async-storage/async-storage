import { TurboModuleRegistry, TurboModule } from "react-native";

export interface Spec extends TurboModule {
  multiGet: (
    keys: string[],
    callback: (error?: Object[], result?: [string, string][]) => void
  ) => void;
  multiSet: (
    kvPairs: [string, string][],
    callback: (error?: Object[]) => void
  ) => void;
  multiRemove: (
    keys: readonly string[],
    callback: (error?: Object[]) => void
  ) => void;
  multiMerge: (
    kvPairs: [string, string][],
    callback: (error?: Object[]) => void
  ) => void;
  getAllKeys: (
    callback: (error?: Object[], result?: [string, string][]) => void
  ) => void;
  clear: (callback: (error?: Object[]) => void) => void;
}

export default TurboModuleRegistry.get<Spec>("RNCAsyncStorage");
