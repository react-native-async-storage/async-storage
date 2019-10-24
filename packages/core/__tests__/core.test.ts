import Factory from '../src';
import {simpleLogger, simpleErrorHandler} from '../src/defaults';
import {createExtension} from '../src/extension';
import {IStorageBackend, LoggerAction} from '../types';

describe('AsyncStorageFactory', () => {
  it('Throws when tried to instantiate', () => {
    expect(() => new Factory()).toThrow(
      "[AsyncStorage] AsyncStorageFactory must not be instantiated.\nInstead, use static functions, like 'create' to get AsyncStorage instance.",
    );
  });
});

describe('SimpleLogger', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation();
  });

  beforeEach(() => {
    // @ts-ignore spy
    console.log.mockReset();
  });

  afterAll(() => {
    // @ts-ignore spy
    console.log.mockRestore();
  });

  it('logs basic info about action', () => {
    const actionInfo: LoggerAction = {
      action: 'save-single',
      key: 'MyKey',
      value: 'MyValue',
    };

    simpleLogger(actionInfo);

    expect(console.log).toBeCalledTimes(1);

    expect(console.log).toBeCalledWith(
      `[AsyncStorage] Saving a value: ${actionInfo.value} for a key: ${
        actionInfo.key
      }`,
    );
  });

  it('handles unknown action by logging it', () => {
    const actionInfo: LoggerAction = {
      // @ts-ignore need to handle unknown
      action: 'my-action',
    };

    simpleLogger(actionInfo);

    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith(
      '[AsyncStorage] Unknown action: my-action',
    );
  });
});

describe('SimpleErrorHandler', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  beforeEach(() => {
    // @ts-ignore spy
    console.error.mockReset();
  });

  afterAll(() => {
    // @ts-ignore spy
    console.error.mockRestore();
  });
  it('logs error when it is a string', () => {
    const errorMessage = 'Fatal!';

    simpleErrorHandler(errorMessage);

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(errorMessage);
  });

  it('logs error when it is an Error', () => {
    const error = new Error('Fatal!');

    simpleErrorHandler(error);

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith('Fatal!');
  });
});

describe('Extension', () => {
  class StorageMock implements IStorageBackend<any> {
    getSingle = jest.fn();
    setSingle = jest.fn();
    getMany = jest.fn();
    setMany = jest.fn();
    removeSingle = jest.fn();
    removeMany = jest.fn();
    getKeys = jest.fn();
    dropStorage = jest.fn();

    extraPublicMethod = jest.fn();

    _privateMethod = jest.fn();

    stringProperty = 'string';
  }

  const storageInst = new StorageMock();

  it.each<keyof IStorageBackend>([
    'getSingle',
    'setSingle',
    'getMany',
    'setMany',
    'removeSingle',
    'removeMany',
    'getKeys',
    'dropStorage',
  ])('does not contain Storage %s methods', methodName => {
    const ext = createExtension<StorageMock>(storageInst);
    // @ts-ignore API methods are excluded
    expect(ext[methodName]).not.toBeDefined();
  });

  it('does not contain private methods or no-function properties', () => {
    const ext = createExtension<StorageMock>(storageInst);

    expect(ext._privateMethod).not.toBeDefined();
    expect(ext.stringProperty).not.toBeDefined();
  });

  it('contains extra methods from Storage', () => {
    storageInst.extraPublicMethod.mockImplementationOnce(() => 'Hello World');

    const ext = createExtension<StorageMock>(storageInst);

    expect(ext.extraPublicMethod).toBeDefined();

    const result = ext.extraPublicMethod('arg', 1);

    expect(storageInst.extraPublicMethod).toBeCalledWith('arg', 1);
    expect(result).toEqual('Hello World');
  });

  it('runs extended methods in Storage context', () => {
    class Str implements IStorageBackend<any> {
      getSingle = jest.fn();
      setSingle = jest.fn();
      getMany = jest.fn();
      setMany = jest.fn();
      removeSingle = jest.fn();
      removeMany = jest.fn();
      getKeys = jest.fn();
      dropStorage = jest.fn();

      private moduleNumber = Math.round(Math.random() * 100);

      private _privateMethod = jest.fn(() => this.moduleNumber);

      extraWork = jest.fn(() => this._privateMethod());
    }

    const instance = new Str();

    const ext = createExtension<Str>(instance);

    const result = ext.extraWork();
    // @ts-ignore
    expect(instance._privateMethod).toBeCalled();
    // @ts-ignore
    expect(result).toEqual(instance.moduleNumber);
  });
});
