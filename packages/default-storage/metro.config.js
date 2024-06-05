const { makeMetroConfig } = require("@rnx-kit/metro-config");
module.exports = makeMetroConfig({
  projectRoot: `${__dirname}/example`,
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
