import type { ConfigPlugin } from "@expo/config-plugins";

import { withNextStorage } from "./android/withNextStorage";
import type { AsyncStorageOptions } from "./types";

const DEFAULT_OPTS: AsyncStorageOptions = {
  android: {
    nextStorage: {
      enabled: false,
    },
  },
};

const withAsyncStorage: ConfigPlugin<AsyncStorageOptions> = (config, props) => {
  const normalizedProps = { ...DEFAULT_OPTS, ...props };
  config = withNextStorage(config, normalizedProps);
  return config;
};

export default withAsyncStorage;
