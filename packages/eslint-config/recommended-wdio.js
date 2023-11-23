const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    plugins: {
      wdio: require("eslint-plugin-wdio"),
    },
  },
  ...compat.extends("plugin:@rnx-kit/recommended", "plugin:wdio/recommended"),
];
