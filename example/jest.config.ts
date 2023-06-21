// eslint-disable-next-line jest/no-jest-import
import { Config as JestConfig } from 'jest';

const config: JestConfig = {
  preset: 'react-native',
  testTimeout: 60000,
  bail: 0,
  rootDir: '..',
  setupFilesAfterEnv: ['./example/jest.setup.ts'],
  testMatch: ['**/?(*.)spec.ts(x)?'],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/node_modules/uuid/wrapper.mjs',
  },
};

export default config;
