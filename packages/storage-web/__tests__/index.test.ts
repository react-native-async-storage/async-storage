import WebStorage from '../src';
import 'jest-localstorage-mock';
import idbMock from 'idb-keyval';

jest.mock('idb-keyval', () => {
  return {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    clear: jest.fn(),
    keys: jest.fn(),
  };
});

describe('WebStorage', () => {
  describe.each([
    ['session', window.sessionStorage],
    ['local', window.localStorage],
  ])('%s storage', (storageName, storageType) => {
    const webStorage = new WebStorage(storageName as 'session' | 'local');

    const storage = storageType as Storage;

    beforeEach(() => {
      storage.clear();
    });

    it('gets single item', async () => {
      storage.setItem('key1', 'value1');
      expect(await webStorage.getSingle('key1')).toBe('value1');
    });

    it('sets single item', async () => {
      await webStorage.setSingle('key1', 'value1');
      expect(storage.__STORE__.key1).toBe('value1');
    });

    it('gets multiple items', async () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      expect(await webStorage.getMany(['key1', 'key2'])).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    it('sets multiple items', async () => {
      await webStorage.setMany([{key1: 'value1'}, {key2: 'value2'}]);
      expect(storage.__STORE__).toEqual({key1: 'value1', key2: 'value2'});
    });

    it('removes single item', async () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      await webStorage.removeSingle('key1');
      expect(storage.__STORE__).toEqual({key2: 'value2'});
    });

    it('removes multiple items', async () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      storage.setItem('key3', 'value3');
      await webStorage.removeMany(['key1', 'key2']);
      expect(storage.__STORE__).toEqual({key3: 'value3'});
    });

    it('gets used keys', async () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      expect(await webStorage.getKeys()).toEqual(['key1', 'key2']);
    });

    it('purges storage', async () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      await webStorage.dropStorage();
      expect(storage.__STORE__).toEqual({});
    });
  });

  describe('idb storage', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    const storage = new WebStorage('idb');

    it('sets a single data', async () => {
      await storage.setSingle('key', 'value');
      expect(idbMock.set).toBeCalledTimes(1);
      expect(idbMock.set).toBeCalledWith('key', 'value');
    });

    it('reads a single value', async () => {
      await storage.getSingle('key');
      expect(idbMock.get).toBeCalledTimes(1);
      expect(idbMock.get).toBeCalledWith('key');
    });

    it('removes a single value', async () => {
      await storage.removeSingle('key1');
      expect(idbMock.del).toBeCalledTimes(1);
      expect(idbMock.del).toBeCalledWith('key1');
    });

    it('calls storage to save multiple data', async () => {
      const keyVals = [{key1: 'value1'}, {key2: {value: [1, 2, 3]}}];

      await storage.setMany(keyVals);
      expect(idbMock.set).toBeCalledTimes(2);
      expect(idbMock.set).toBeCalledWith('key1', 'value1');
      expect(idbMock.set).toBeCalledWith('key2', {value: [1, 2, 3]});
    });

    it('calls storage to read multiple data', async () => {
      // @ts-ignore jest mock
      idbMock.get.mockImplementation(async (key: string) => {
        switch (key) {
          case 'key1':
            return 'value1';
          case 'key2':
            return [1, 2, 3];
          case 'key3':
            return true;
          default:
            return null;
        }
      });

      const values = await storage.getMany(['key1', 'key2', 'key3']);

      expect(idbMock.get).toBeCalledTimes(3);
      expect(idbMock.get).toBeCalledWith('key1');
      expect(idbMock.get).toBeCalledWith('key2');
      expect(idbMock.get).toBeCalledWith('key3');
      expect(values).toEqual({
        key1: 'value1',
        key2: [1, 2, 3],
        key3: true,
      });
    });

    it('calls storage to remove multiple data', async () => {
      await storage.removeMany(['key1', 'key2', 'key3']);
      expect(idbMock.del).toBeCalledTimes(3);
      expect(idbMock.del).toBeCalledWith('key1');
      expect(idbMock.del).toBeCalledWith('key2');
      expect(idbMock.del).toBeCalledWith('key3');
    });

    it('reads and returns used keys', async () => {
      // @ts-ignore jest-mock
      idbMock.keys.mockImplementationOnce(async () => ['key1', 'key2', 'key3']);

      const usedKeys = await storage.getKeys();

      expect(idbMock.keys).toBeCalledTimes(1);
      expect(usedKeys).toEqual(['key1', 'key2', 'key3']);
    });

    it('purges storage', async () => {
      await storage.dropStorage();
      expect(idbMock.clear).toBeCalledTimes(1);
    });
  });
});
