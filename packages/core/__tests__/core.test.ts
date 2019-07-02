import Factory from '../src';
import {simpleLogger, simpleErrorHandler} from '../src/defaults';

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
