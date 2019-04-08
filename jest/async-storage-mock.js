/**
 * @format
 * @flow
 */

type KeysType = Array<string>;
type KeyValueType = Array<Array<*>>;
type CallbackType = ((?Error) => void) | void;
type ItemGetCallbackType = (?Error, ?string) => void;
type ResultCallbackType = ((?Error, ?KeyValueType) => void) | void;

const asMock = {
  __INTERNAL_MOCK_STORAGE__: {},

  setItem: jest.fn<[string, string, CallbackType], Promise<*>>(
    async (key: string, value: string, callback: CallbackType) => {
      const setResult = await asMock.multiSet([[key, value]], undefined);

      callback && callback(setResult);
      return setResult;
    },
  ),
  getItem: jest.fn<[string, ItemGetCallbackType], Promise<*>>(
    async (key: string, callback: ItemGetCallbackType) => {
      const getResult = await asMock.multiGet([key], undefined);

      const result = getResult[0] ? getResult[0][1] : null;

      callback && callback(null, result);
      return result;
    },
  ),
  removeItem: jest.fn<[string, CallbackType], Promise<null>>(
    (key: string, callback: CallbackType) =>
      asMock.multiRemove([key], callback),
  ),
  mergeItem: jest.fn<[string, string, CallbackType], Promise<*>>(
    (key: string, value: string, callback: CallbackType) =>
      asMock.multiMerge([[key, value]], callback),
  ),

  clear: jest.fn<[CallbackType], Promise<*>>(_clear),
  getAllKeys: jest.fn<[], void>(),
  flushGetRequests: jest.fn<[], void>(),

  multiGet: jest.fn<[KeysType, ResultCallbackType], Promise<*>>(_multiGet),
  multiSet: jest.fn<[KeyValueType, CallbackType], Promise<*>>(_multiSet),
  multiRemove: jest.fn<[KeysType, CallbackType], Promise<*>>(_multiRemove),
  multiMerge: jest.fn<[KeyValueType, CallbackType], Promise<*>>(_multiMerge),
};

async function _multiSet(keyValuePairs: KeyValueType, callback: CallbackType) {
  keyValuePairs.forEach(keyValue => {
    const key = keyValue[0];
    const value = keyValue[1];

    asMock.__INTERNAL_MOCK_STORAGE__[key] = value;
  });
  callback && callback(null);
  return null;
}

async function _multiGet(keys: KeysType, callback: ResultCallbackType) {
  const values = keys.map(key => [
    key,
    asMock.__INTERNAL_MOCK_STORAGE__[key] || null,
  ]);
  callback && callback(null, values);

  return values;
}

async function _multiRemove(keys: KeysType, callback: CallbackType) {
  keys.forEach(key => {
    if (asMock.__INTERNAL_MOCK_STORAGE__[key]) {
      delete asMock.__INTERNAL_MOCK_STORAGE__[key];
    }
  });

  callback && callback(null);
  return null;
}

async function _clear(callback: CallbackType) {
  asMock.__INTERNAL_MOCK_STORAGE__ = {};

  callback && callback(null);

  return null;
}

async function _multiMerge(
  keyValuePairs: KeyValueType,
  callback: CallbackType,
) {
  keyValuePairs.forEach(keyValue => {
    const key = keyValue[0];
    const value = JSON.parse(keyValue[1]);

    const oldValue = JSON.parse(asMock.__INTERNAL_MOCK_STORAGE__[key]);

    const processedValue = JSON.stringify(_deepMergeInto(oldValue, value));

    asMock.__INTERNAL_MOCK_STORAGE__[key] = processedValue;
  });

  callback && callback(null);
  return null;
}

const _isObject = obj => typeof obj === 'object' && !Array.isArray(obj);
const _deepMergeInto = (oldObject, newObject) => {
  const newKeys = Object.keys(newObject);
  const mergedObject = oldObject;

  newKeys.forEach(key => {
    const oldValue = mergedObject[key];
    const newValue = newObject[key];

    if (_isObject(oldValue) && _isObject(newValue)) {
      mergedObject[key] = _deepMergeInto(oldValue, newValue);
    } else {
      mergedObject[key] = newValue;
    }
  });

  return mergedObject;
};

export default asMock;
