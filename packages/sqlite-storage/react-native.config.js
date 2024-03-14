const path = require("path");
const project = (() => {
  try {
    const { configureProjects } = require("react-native-test-app");
    return configureProjects({
      android: {
        sourceDir: path.join("example", "android"),
      },
      ios: {
        sourceDir: path.join("example", "ios"),
      },
    });
  } catch (_) {
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    "@react-native-async-storage/sqlite-storage": {
      root: __dirname,
    },
  },
  ...(project ? { project } : undefined),
};
