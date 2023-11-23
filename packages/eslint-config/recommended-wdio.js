const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const wdio = require("eslint-plugin-wdio");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends("plugin:@rnx-kit/recommended"),
  {
    plugins: {
      wdio,
    },
  },
  ...compat.config(wdio.configs.recommended),
];
