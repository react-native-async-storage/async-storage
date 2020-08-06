/**
 * @format
 * @flow
 */
import merge from 'deep-assign';

let __storage = {};

const AsyncStorageNativeModuleFake = {
  multiGet(keys: string[], cb: (?Object, ?(string[][])) => void) {
    if (!keys) {
      cb({message: 'No keys provided'});
    }

    const keysValues = keys.reduce(
      (acc, key) => [...acc, [key, __storage[key]]],
      [],
    );

    // error, value
    cb(null, keysValues);
  },

  multiSet(keyValues: string[][], cb: (?Object) => void) {
    if (!keyValues) {
      cb({message: 'no keys provided'});
    }
    try {
      keyValues.forEach(pair => {
        if (!pair[0] === undefined || !pair[1] === undefined) {
          throw 'pairs not matching';
        }
        __storage[pair[0]] = pair[1];
      });
    } catch (e) {
      cb({message: e});
    }
    cb();
  },

  multiRemove(keys: string[], cb: (?Object) => void) {
    if (!keys) {
      cb({message: 'keys not provided'});
    }
    keys.forEach(k => {
      delete __storage[k];
    });

    cb();
  },

  multiMerge(keyValues: string[], cb: (?Object) => void) {
    if (!keyValues) {
      cb({message: 'keys not provided'});
    }

    try {
      keyValues.forEach(pair => {
        if (!pair[0] || !pair[1]) {
          throw 'pairs not matching';
        }

        const storedValue = __storage[pair[0]];
        const merged = merge({}, JSON.parse(storedValue), JSON.parse(pair[1]));

        __storage[pair[0]] = JSON.stringify(merged);
      });

      cb();
    } catch (e) {
      cb({message: e});
    }

    cb();
  },

  clear(cb: (?Object) => void) {
    __storage = {};

    cb();
  },
};

export default AsyncStorageNativeModuleFake;
