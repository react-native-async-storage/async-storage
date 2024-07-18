const { makeMetroConfig } = require("@rnx-kit/metro-config");
const path = require("node:path");

module.exports = makeMetroConfig({
  projectRoot: path.join(__dirname, "example"),
  watchFolders: [__dirname],
  resolver: {
    extraNodeModules: {
      "@react-native-async-storage/async-storage": __dirname,
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
