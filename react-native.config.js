/**
 * This cli config is needed for the coexistance of react-native and other
 * out-of-tree implementations such react-native-macos.
 * The following issue is tracked by
 * https://github.com/react-native-community/discussions-and-proposals/issues/182
 *
 * The work-around involves having a metro.config.js for each out-of-tree
 * platform, i.e. metro.config.js for react-native and
 * metro.config.macos.js for react-native-macos.
 * This react-native.config.js looks for a --use-react-native-macos
 * switch and when present pushes --config=metro.config.macos.js
 * and specifies reactNativePath: 'node_modules/react-native-macos'.
 * The metro.config.js has to blacklist 'node_modules/react-native-macos',
 * and conversely metro.config.macos.js has to blacklist 'node_modules/react-native'.
 */
'use strict';

const path = require('path');

const dependencies = {
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
};

if (
  process.argv.includes('--use-react-native-windows') ||
  process.argv.includes('autolink-windows') ||
  process.argv.includes('run-windows')
) {
  const sourceDir = path.join('example', 'windows');
  module.exports = {
    dependencies,
    project: {
      // `@react-native-community/cli` mistakes
      // `windows/ReactNativeAsyncStorage.sln` and
      // `windows/ReactNativeAsyncStorage/ReactNativeAsyncStorage.vcxproj` for
      // being the main project files. We need to help it find the solution file
      // under `example/windows/` and the generated project files in
      // `node_modules/.generated/windows`.
      windows: {
        sourceDir,
        solutionFile: 'AsyncStorageExample.sln',
        project: {
          projectFile: path.relative(
            sourceDir,
            path.join(
              'node_modules',
              '.generated',
              'windows',
              'ReactTestApp',
              'ReactTestApp.vcxproj'
            )
          ),
        },
      },
    },
    reactNativePath: path.join('node_modules', 'react-native-windows'),
  };
} else {
  module.exports = { dependencies };
}
