/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {ExtensionType, IStorageBackend} from '../types';

// Methods available in storage API, to be excluded from the extension
const EXCLUDED_METHODS = [
  'getSingle',
  'setSingle',
  'getMany',
  'setMany',
  'removeSingle',
  'removeMany',
  'getKeys',
  'dropStorage',
];

/*
 * Extension is an object containing 'public', function-type properties of Storage instance
 * To property be include in the extension, it has to meet three conditions:
 * - has public accessor
 * - has to be a function
 * - cannot start with an underscore (convention considered private in JS)
 *
 * All methods in the extensions are called in Storage instance context
 */
export function createExtension<T extends IStorageBackend>(
  storageInstance: T,
): ExtensionType<T> {
  const propertyNames = Object.getOwnPropertyNames(storageInstance).filter(
    propName => {
      return (
        EXCLUDED_METHODS.indexOf(propName) === -1 &&
        !propName.startsWith('_') &&
        // @ts-ignore this is a property on the instance
        typeof storageInstance[propName] === 'function'
      );
    },
  );

  let extension = {};
  propertyNames.forEach(propName => {
    const desc = {
      enumerable: true,
      get: function() {
        // @ts-ignore this is a property on the instance
        return storageInstance[propName].bind(storageInstance);
      },
    };

    Object.defineProperty(extension, propName, desc);
  });

  Object.seal(extension);
  return extension as ExtensionType<T>;
}
