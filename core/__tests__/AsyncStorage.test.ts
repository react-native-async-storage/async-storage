import AsyncStorage from '../src/AsyncStorage';

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
    jest.resetAllMocks();
  });

  describe('main API', () => {
    it.each(['get', 'set', 'remove'])(
      'handles single %s api call',
      async (methodName: string) => {
        const as = new AsyncStorage(mockedStorage, {
          logger: false,
          errorHandler: false,
        });

        const key = 'myKey';
        const value = {
          name: 'Jerry',
        };

        switch (methodName) {
          case 'get': {
            await as.get(key);
            expect(mockedStorage.getSingle).toBeCalledWith(key, null);
            break;
          }

          case 'set': {
            await as.set(key, value);
            expect(mockedStorage.setSingle).toBeCalledWith(key, value, null);
            break;
          }

          case 'remove': {
            await as.remove(key);
            expect(mockedStorage.removeSingle).toBeCalledWith(key, null);
            break;
          }
        }
      },
    );

    it.each(['set', 'read', 'remove'])(
      'handles basic multi %s api call',
      async (methodName: string) => {
        const keys = ['key1', 'key2', 'key3'];
        const keyValues = [
          {key1: 'value1'},
          {key2: 'value2'},
          {key3: 'value3'},
        ];

        const as = new AsyncStorage(mockedStorage, {
          logger: false,
          errorHandler: false,
        });

        switch (methodName) {
          case 'get': {
            await as.getMultiple(keys);
            expect(mockedStorage.getMany).toBeCalledWith(keys, null);
            break;
          }

          case 'set': {
            await as.setMultiple(keyValues);
            expect(mockedStorage.setMany).toBeCalledWith(keyValues, null);
            break;
          }

          case 'remove': {
            await as.removeMultiple(keys);
            expect(mockedStorage.removeMany).toBeCalledWith(keys, null);
            break;
          }
        }
      },
    );

    it.each(['instance', 'getKeys', 'clearStorage'])(
      'handles %s api call',
      async (methodName: string) => {
        const asyncStorage = new AsyncStorage(mockedStorage, {
          logger: false,
          errorHandler: false,
        });

        switch (methodName) {
          case 'instance': {
            expect(asyncStorage.instance()).toBe(mockedStorage);
            break;
          }

          case 'getKeys': {
            mockedStorage.getKeys.mockImplementationOnce(() => [
              'key1',
              'key2',
            ]);
            const keys = await asyncStorage.getKeys();
            expect(keys).toEqual(['key1', 'key2']);
            break;
          }

          case 'dropStorage': {
            await asyncStorage.clearStorage();
            expect(mockedStorage.dropStorage).toBeCalledTimes(1);
            break;
          }
        }
      },
    );
  });
  describe('utils', () => {
    it('uses logger when provided', async () => {
      const loggerFunc = jest.fn();

      const as = new AsyncStorage(mockedStorage, {
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

      const as = new AsyncStorage(mockedStorage, {
        errorHandler,
        logger: false,
      });

      await as.get('key');

      expect(errorHandler).toBeCalledTimes(1);
      expect(errorHandler).toBeCalledWith(error);
    });
  });
});
