/**
 * This cli config is needed for development purposes, e.g. for running
 * integration tests during local development or on CI services.
 */

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

const rnmPath = path.resolve(__dirname, 'node_modules/react-native-macos');

module.exports = {
  projectRoot: `${__dirname}/example`,
  watchFolders: [__dirname],
  resolver: {
    extraNodeModules: {
      'react-native': rnmPath,
    },
    blacklistRE: blacklist([/node_modules\/react-native\/.*/]),
    platforms: ['macos', 'ios'],
  },
};
