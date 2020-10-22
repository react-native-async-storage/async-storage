/**
 * @format
 */

import mockAsyncStorage from '../jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
