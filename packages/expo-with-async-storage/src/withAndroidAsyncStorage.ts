import { type ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";
import type { WithAsyncStorageConfig } from "./types";

export const withAndroidAsyncStorage: ConfigPlugin<WithAsyncStorageConfig> = (
  config,
  props
) => {
  // config
  return withProjectBuildGradle(config, (mod) => {
    mod.modResults.contents = JSON.stringify(props);
    return mod;
  });
};
