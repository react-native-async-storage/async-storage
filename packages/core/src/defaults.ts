/**
 * Copyright (c) React Native Community.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {FactoryOptions, LoggerAction} from '../types';

export const factoryOptions: FactoryOptions = {
  logger: false,
  errorHandler: false,
};

export function simpleErrorHandler(e: Error | string) {
  let errorMessage = e instanceof Error ? e.message : e;
  console.error(errorMessage);
}

export function simpleLogger(logInfo: LoggerAction) {
  const log = (message: string) => {
    console.log(`[AsyncStorage] ${message}`);
  };

  const {action, key, value} = logInfo;

  switch (action) {
    case 'read-single': {
      log(`Reading a value for a key: ${key}`);
      break;
    }
    case 'save-single': {
      log(`Saving a value: ${value} for a key: ${key}`);
      break;
    }
    case 'delete-single': {
      log(`Removing value at a key: ${key}`);
      break;
    }
    case 'read-many': {
      log(`Reading values for keys: ${key}`);
      break;
    }
    case 'save-many': {
      log(`Saving values ${value} for keys: ${key}`);
      break;
    }
    case 'delete-many': {
      log(`Removing multiple values for keys: ${key}`);
      break;
    }
    case 'drop': {
      log('Dropping whole database');
      break;
    }
    case 'keys': {
      log('Retrieving keys');
      break;
    }
    default: {
      log(`Unknown action: ${action}`);
    }
  }
}

export function noop() {
  // noop
}
