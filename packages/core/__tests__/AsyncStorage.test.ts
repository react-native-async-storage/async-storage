import AsyncStorage from '../src/AsyncStorage';
import {IStorageBackend} from '../types';

class StorageMock implements IStorageBackend<any> {
  getSingle = jest.fn();
  setSingle = jest.fn();
  getMany = jest.fn();
  setMany = jest.fn();
  removeSingle = jest.fn();
  removeMany = jest.fn();
  getKeys = jest.fn();
  dropStorage = jest.fn();
}

describe('AsyncStorage', () => {
  const mockedStorage = new StorageMock();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  type testCases = [
    Partial<keyof AsyncStorage<any, any>>,
    Partial<keyof StorageMock>,
    string
  ][];

  describe('main API', () => {
    const asyncStorage = new AsyncStorage<any, any>(mockedStorage, {
      logger: false,
      errorHandler: false,
    });

    it.each([
      ['get', 'getSingle', 'myKey'],
      ['set', 'setSingle', 'mySecret', 'myValue'],
      ['remove', 'removeSingle', 'removeKey'],
      ['getMultiple', 'getMany', ['key1', 'key2']],
      ['setMultiple', 'setMany', [{key1: 'value1'}, {key2: 'value2'}]],
      ['removeMultiple', 'removeMany', ['remove1', 'remove2']],
      ['clearStorage', 'dropStorage'],
    ] as testCases)(
      'handles %s api call',
      async (method, mock, ...data: Array<string>) => {
        // @ts-ignore provided enough args
        await asyncStorage[method](...data, null);

        expect(mockedStorage[mock]).toBeCalledWith(...data, null);
      },
    );

    it('handles getKey api call', async () => {
      mockedStorage.getKeys.mockImplementationOnce(() => ['key1', 'key2']);
      const keys = await asyncStorage.getKeys();
      expect(keys).toEqual(['key1', 'key2']);
    });
  });
  describe('utils', () => {
    it('uses logger when provided', async () => {
      const loggerFunc = jest.fn();

      const as = new AsyncStorage<any, any>(mockedStorage, {
        logger: loggerFunc,
        errorHandler: false,
      });

      await as.get('key');
      expect(loggerFunc).toBeCalledTimes(1);
      expect(loggerFunc).toBeCalledWith({action: 'read-single', key: 'key'});
    });

    it('uses error handler when provided', async () => {
      const errorHandler = jest.fn();

      const error = new Error('Fatal!');
      mockedStorage.getSingle.mockImplementationOnce(async () => {
        throw error;
      });

      const as = new AsyncStorage<any, any>(mockedStorage, {
        errorHandler,
        logger: false,
      });

      await as.get('key');

      expect(errorHandler).toBeCalledTimes(1);
      expect(errorHandler).toBeCalledWith(error);
    });
  });
});
