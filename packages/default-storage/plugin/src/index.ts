import type { ConfigPlugin} from '@expo/config-plugins';
import { withGradleProperties } from '@expo/config-plugins';

export type AsyncStorageOptions = {
  useNextStorage?: boolean;
}

const withUseNextStorage: ConfigPlugin<AsyncStorageOptions> = (config, { useNextStorage = false }) => {
  if (!useNextStorage) {
    return config;
  }

  return withGradleProperties(config, (config) => {
    config.modResults.push({
      key: 'AsyncStorage_useNextStorage',
      value: 'true',
      type: 'property',
    });

    return config;
  });
};

const DEFAULT_OPTS: AsyncStorageOptions = {
  useNextStorage: false,
}

const withAsyncStorage: ConfigPlugin<AsyncStorageOptions> = (config, props) => {
  const normalizedProps = { ...DEFAULT_OPTS, ...props };
  config = withUseNextStorage(config, normalizedProps);
  return config;
};

export default withAsyncStorage;
