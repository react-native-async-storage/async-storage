const project = (() => {
  const fs = require('fs');
  const path = require('path');
  try {
    const {
      androidManifestPath,
      iosProjectPath,
      windowsProjectPath,
    } = require('react-native-test-app');
    return {
      android: {
        sourceDir: path.join('example', 'android'),
        manifestPath: androidManifestPath(
          path.join(__dirname, 'example', 'android')
        ),
      },
      ios: {
        project: iosProjectPath('example/ios'),
      },
      windows: fs.existsSync('example/windows/AsyncStorageExample.sln') && {
        sourceDir: path.join('example', 'windows'),
        solutionFile: 'AsyncStorageExample.sln',
        project: windowsProjectPath(path.join(__dirname, 'example', 'windows')),
      },
    };
  } catch (_) {
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    '@react-native-async-storage/async-storage': {
      root: __dirname,
      // rn-cli incorrectly resolves node_modules path for the following platforms
      platforms: {
        ios: null,
        macos: null,
      },
    },
    // Suppress warnings about bob not being a proper native module
    '@react-native-community/bob': {
      platforms: {
        android: null,
        ios: null,
        macos: null,
        windows: null,
      },
    },
    // We don't use Expo in our test apps
    expo: {
      platforms: {
        android: null,
        ios: null,
        macos: null,
        windows: null,
      },
    },
  },
  ...(project ? { project } : undefined),
};
