import type { ConfigPlugin} from "@expo/config-plugins";
import { withGradleProperties } from "@expo/config-plugins";

import type { AsyncStorageOptions } from "../types";

export const withNextStorage: ConfigPlugin<AsyncStorageOptions> = (
  config,
  props
) => {
  const useNextStorage = props?.android?.nextStorage?.enabled ?? false;

  if (!useNextStorage) {
    return config;
  }

  return withGradleProperties(config, (config) => {
    config.modResults.push({
      key: "AsyncStorage_useNextStorage",
      value: "true",
      type: "property",
    });

    return config;
  });
};
