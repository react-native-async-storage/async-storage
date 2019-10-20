function createPackageConfig(packageName) {
  return {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    globals: {
      __DEV__: true,
      'ts-jest': {
        tsConfig: `<rootDir>/packages/${packageName}/tsconfig.json`,
      },
    },
    displayName: packageName,
    roots: [`<rootDir>/packages/${packageName}`],
    testMatch: [`<rootDir>/packages/${packageName}/__tests__/*{.,-}test.ts`],
  };
}

module.exports = {
  projects: [createPackageConfig('core'), createPackageConfig('storage-web')],
};
