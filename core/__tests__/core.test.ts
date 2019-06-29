import Factory from '../src/';
import {simpleLogger, simpleErrorHandler} from '../src/defaults';

describe('AsyncStorageFactory', () => {
  it('Throws when tried to instantiate', () => {
    expect(() => new Factory()).toThrow();
  });
});

describe('SimpleLogger', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation();
  });

  beforeEach(() => {
    console.log.mockReset();
  });

  afterAll(() => {
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

    const callArgs = console.log.mock.calls[0][0];
    expect(callArgs).toContain('[AsyncStorage]');
    expect(callArgs).toContain(actionInfo.key);
    expect(callArgs).toContain(actionInfo.value);
  });

  it('handles unknown action by logging it', () => {
    const actionInfo: LoggerAction = {
      // @ts-ignore need to handle unknown
      action: 'unknown-action',
    };

    simpleLogger(actionInfo);

    expect(console.log).toBeCalledTimes(1);

    const callArgs = console.log.mock.calls;
    expect(callArgs[0][0]).toContain('unknown-action');
  });
});

describe('SimpleErrorHandler', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  beforeEach(() => {
    console.error.mockReset();
  });

  afterAll(() => {
    console.error.mockRestore();
  });
  it('logs error when it is a string', () => {
    const errorMessage = 'Fatal!';

    simpleErrorHandler(errorMessage);

    expect(console.error).toBeCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toEqual(errorMessage);
  });

  it('logs error when it is an Error', () => {
    const error = new Error('Fatal!');

    simpleErrorHandler(error);

    expect(console.error).toBeCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toEqual(error.message);
  });
});
