import type { ConfigPlugin } from "@expo/config-plugins";
import { createRunOncePlugin } from "@expo/config-plugins";
import { withAndroidAsyncStorage } from "./withAndroidAsyncStorage";
import type { WithAsyncStorageConfig } from "./types";

const pluginName = "withAsyncStorage";
const pluginVersion: string = require("../package.json").version;

const withAsyncStorage: ConfigPlugin<WithAsyncStorageConfig> = (
  config,
  props = {}
) => {
  config = withAndroidAsyncStorage(config, props);

  return config;
};

export default createRunOncePlugin(withAsyncStorage, pluginName, pluginVersion);
