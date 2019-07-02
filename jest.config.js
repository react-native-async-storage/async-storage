const commonSettings = {
  globals: {
    __DEV__: true,
  },
};

module.exports = {
  projects: [
    {
      ...commonSettings,
      displayName: 'core',
      roots: ['<rootDir>/packages/core'],
      testMatch: ['<rootDir>/packages/core/__tests__/*{.,-}test.ts'],
    },
  ],
};
