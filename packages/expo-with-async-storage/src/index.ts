import type { ConfigPlugin } from "@expo/config-plugins";
import { createRunOncePlugin } from "@expo/config-plugins";
import { withAndroidAsyncStorage } from "./withAndroidAsyncStorage";

const pluginName = "withAsyncStorage";
const pluginVersion: string = require("../package.json").version;

const withAsyncStorage: ConfigPlugin = (config) => {
  config = withAndroidAsyncStorage(config);

  return config;
};

export default createRunOncePlugin(withAsyncStorage, pluginName, pluginVersion);
