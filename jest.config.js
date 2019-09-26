const commonSettings = {
  globals: {
    __DEV__: true,
  },
};

module.exports = {
  setupFiles: ['jest-localstorage-mock'],
  projects: [
    {
      ...commonSettings,
      displayName: 'core',
      roots: ['<rootDir>/packages/core', '<rootDir>/packages/storage-web'],
      testMatch: [
        '<rootDir>/packages/core/__tests__/*{.,-}test.ts',
        '<rootDir>/packages/storage-web/__tests__/*{.,-}test.ts',
      ],
    },
  ],
};
