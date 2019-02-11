module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@react-native-community/asyns-storage': './lib/AsyncStorage',
        },
        cwd: 'babelrc',
      },
    ],
  ],
};
