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

const macSwitch = '--use-react-native-macos';
const windowsSwitch = '--use-react-native-windows';

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
  // react-native-test-app is currently only set up for macOS and Windows
  'react-native-test-app': {
    platforms: {
      android: null,
      ios: null,
    },
  },
};

if (process.argv.includes(macSwitch)) {
  process.argv = process.argv.filter(arg => arg !== macSwitch);
  process.argv.push('--config=metro.config.macos.js');
  module.exports = {
    dependencies,
    reactNativePath: 'node_modules/react-native-macos',
  };
} else if (process.argv.includes(windowsSwitch)) {
  process.argv = process.argv.filter(arg => arg !== windowsSwitch);
  process.argv.push('--config=./metro.config.windows.js');
  module.exports = {
    dependencies,
    reactNativePath: 'node_modules/react-native-windows',
  };
} else {
  module.exports = { dependencies };
}
