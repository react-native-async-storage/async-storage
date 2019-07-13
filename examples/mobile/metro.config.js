const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const escape = require('escape-string-regexp');


module.exports = {
  projectRoot: __dirname,
  watchFolders: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../packages/core/build'),
    path.resolve(__dirname, '../../packages/storage-legacy/build'),
  ],

  resolver: {
    blacklistRE: blacklist([
      new RegExp(
        `^${escape(path.resolve(__dirname, '../..', 'node_modules/react-native'))}\\/.*$`
      ),
    ]),
  },
};
