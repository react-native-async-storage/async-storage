/* eslint-disable no-undef */

const merge = require("merge-options").bind({
  concatArrays: true,
  ignoreUndefined: true,
});

const asMock = {
  __INTERNAL_MOCK_STORAGE__: {},

  setItem: jest.fn(async (key, value, callback) => {
    const setResult = await asMock.multiSet([[key, value]], undefined);

    callback && callback(setResult);
    return setResult;
  }),

  getItem: jest.fn(async (key, callback) => {
    const getResult = await asMock.multiGet([key], undefined);

    const result = getResult[0] ? getResult[0][1] : null;

    callback && callback(null, result);
    return result;
  }),

  removeItem: jest.fn((key, callback) => asMock.multiRemove([key], callback)),
  mergeItem: jest.fn((key, value, callback) =>
    asMock.multiMerge([[key, value]], callback)
  ),

  clear: jest.fn(_clear),
  getAllKeys: jest.fn(_getAllKeys),
  flushGetRequests: jest.fn(),

  multiGet: jest.fn(_multiGet),
  multiSet: jest.fn(_multiSet),
  multiRemove: jest.fn(_multiRemove),
  multiMerge: jest.fn(_multiMerge),
  useAsyncStorage: jest.fn((key) => {
    return {
      getItem: (...args) => asMock.getItem(key, ...args),
      setItem: (...args) => asMock.setItem(key, ...args),
      mergeItem: (...args) => asMock.mergeItem(key, ...args),
      removeItem: (...args) => asMock.removeItem(key, ...args),
    };
  }),
  useAsyncStorageObject: jest.fn((key) => {
    return {
      getItem: async () => {
        const item = await asMock.getItem(key);
        if (item === null) {
          return null;
        }
        try {
          return JSON.parse(item);
        } catch (error) {
          console.warn(
            `Failed to parse JSON for key "${key}":`,
            error instanceof Error ? error.message : error
          );
          return null;
        }
      },
      setItem: async (value) => {
        const stringValue = JSON.stringify(value);
        await asMock.setItem(key, stringValue);
      },
      mergeItem: async (value) => {
        const existingItem = await asMock.getItem(key);
        let existingObject;

        if (existingItem === null) {
          existingObject = value;
        } else {
          try {
            existingObject = JSON.parse(existingItem);
          } catch (parseError) {
            console.warn(
              `Failed to parse existing JSON for key "${key}", replacing with new value:`,
              parseError instanceof Error ? parseError.message : parseError
            );
            existingObject = value;
          }
        }

        const merged = deepMerge(existingObject, value);
        const stringValue = JSON.stringify(merged);
        await asMock.setItem(key, stringValue);
      },
      removeItem: async () => {
        await asMock.removeItem(key);
      },
    };
  }),
};

function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        output[key] = sourceValue;
      }
    }
  }

  return output;
}

async function _multiSet(keyValuePairs, callback) {
  keyValuePairs.forEach((keyValue) => {
    const key = keyValue[0];

    asMock.__INTERNAL_MOCK_STORAGE__[key] = keyValue[1];
  });
  callback && callback(null);
  return null;
}

async function _multiGet(keys, callback) {
  const values = keys.map((key) => [
    key,
    asMock.__INTERNAL_MOCK_STORAGE__[key] || null,
  ]);
  callback && callback(null, values);

  return values;
}

async function _multiRemove(keys, callback) {
  keys.forEach((key) => {
    if (asMock.__INTERNAL_MOCK_STORAGE__[key]) {
      delete asMock.__INTERNAL_MOCK_STORAGE__[key];
    }
  });

  callback && callback(null);
  return null;
}

async function _clear(callback) {
  asMock.__INTERNAL_MOCK_STORAGE__ = {};

  callback && callback(null);

  return null;
}

async function _getAllKeys() {
  return Object.keys(asMock.__INTERNAL_MOCK_STORAGE__);
}

async function _multiMerge(keyValuePairs, callback) {
  keyValuePairs.forEach((keyValue) => {
    const [key, value] = keyValue;
    const oldValue = asMock.__INTERNAL_MOCK_STORAGE__[key];
    asMock.__INTERNAL_MOCK_STORAGE__[key] =
      oldValue != null
        ? JSON.stringify(merge(JSON.parse(oldValue), JSON.parse(value)))
        : value;
  });

  callback && callback(null);
  return null;
}

module.exports = asMock;
