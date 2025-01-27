const { makeMetroConfig } = require("@rnx-kit/metro-config");
const path = require("node:path");

module.exports = makeMetroConfig({
  projectRoot: __dirname,
  watchFolders: [__dirname, path.resolve(__dirname, "..")],
  resolver: {
    extraNodeModules: {
      "@react-native-async-storage/sqlite-storage": path.resolve(
        __dirname,
        ".."
      ),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
});
