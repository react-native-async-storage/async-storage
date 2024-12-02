const path = require("path");
const pkg = require("../package.json");
const { configureProjects } = require("react-native-test-app");

module.exports = {
  project: configureProjects({
    android: {
      sourceDir: "android",
    },
    ios: {
      sourceDir: "ios",
      automaticPodsInstallation: true,
    },
    macos: {
      sourceDir: "macos",
    },
    windows: {
      sourceDir: "windows",
      solutionFile: path.join("windows", "AsyncStorageExample.sln"),
    },
  }),
  dependencies: {
    [pkg.name]: {
      root: path.join(__dirname, ".."),
    },
  },
};
