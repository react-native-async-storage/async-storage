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
      roots: ['<rootDir>/core', '<rootDir>/storages/**/'],
      testMatch: ['<rootDir>/core/__tests__/*{.,-}test.ts'],
    },
  ],
};
