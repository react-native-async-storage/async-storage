// eslint-disable-next-line jest/no-jest-import
import { Config as JestConfig } from 'jest';

const config: JestConfig = {
  preset: 'react-native',
  testTimeout: 120000,
  bail: 0,
  rootDir: '..',
  transform: {},
  setupFilesAfterEnv: ['./example/jest.setup.ts'],
  testMatch: ['**/?(*.)spec.ts(x)?'],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/node_modules/uuid/wrapper.mjs',
  },
};

export default config;
