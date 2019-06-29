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
    it('handles basic set/read/remove calls', async () => {
      const as = new AsyncStorage(mockedStorage, {
        logger: false,
        errorHandler: false,
      });

      const key = 'myKey';
      const value = {
        name: 'Jerry',
      };

      // get
      await as.get(key);
      expect(mockedStorage.getSingle).toBeCalledWith(key, null);

      //set
      await as.set(key, value);
      expect(mockedStorage.setSingle).toBeCalledWith(key, value, null);

      // remove
      await as.remove(key);
      expect(mockedStorage.removeSingle).toBeCalledWith(key, null);
    });

    it('handles basic multi set/read/remove calls', async () => {
      const keys = ['key1', 'key2', 'key3'];
      const keyValues = [{key1: 'value1'}, {key2: 'value2'}, {key3: 'value3'}];

      const as = new AsyncStorage(mockedStorage, {
        logger: false,
        errorHandler: false,
      });

      // set
      await as.setMultiple(keyValues);
      expect(mockedStorage.setMany).toBeCalledWith(keyValues, null);

      // get
      await as.getMultiple(keys);
      expect(mockedStorage.getMany).toBeCalledWith(keys, null);

      // remove
      await as.removeMultiple(keys);
      expect(mockedStorage.removeMany).toBeCalledWith(keys, null);
    });

    it('handles getKeys/clearStorage/instance calls', async () => {
      const asyncStorage = new AsyncStorage(mockedStorage, {
        logger: false,
        errorHandler: false,
      });

      // instance
      expect(asyncStorage.instance()).toBe(mockedStorage);

      //drop storage
      await asyncStorage.clearStorage();
      expect(mockedStorage.dropStorage).toBeCalledTimes(1);

      // getKeys
      mockedStorage.getKeys.mockImplementationOnce(() => ['key1', 'key2']);
      const keys = await asyncStorage.getKeys();

      expect(keys).toEqual(['key1', 'key2']);
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
        expect(errorHandler.mock.calls[0][0]).toBe(error);
      });
    });
  });
});
