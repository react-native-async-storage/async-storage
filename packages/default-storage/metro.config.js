/**
 * This cli config is needed for development purposes, e.g. for running
 * integration tests during local development or on CI services.
 */

const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

module.exports = {
  projectRoot: `${__dirname}/example`,
  watchFolders: [__dirname],
  resolver: {
    blockList: exclusionList([
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path
          .resolve(__dirname, 'example', 'windows')
          .replace(/[/\\]/g, '/')}.*`
      ),

      // Workaround for `EBUSY: resource busy or locked, open '~\msbuild.ProjectImports.zip'`
      // when building with `yarn windows --release`
      /.*\.ProjectImports\.zip/,
    ]),
  },
};
