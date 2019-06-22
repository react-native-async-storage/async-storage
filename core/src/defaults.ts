/**
 * By default, logging and error handling are done only in dev
 */
export const factoryOptions: FactoryOptions = {
  logger: __DEV__,
  errorHandler: __DEV__,
};

export function simpleErrorHandler(e: Error | string) {
  if (__DEV__) {
    let errorMessage = e instanceof Error ? e.message : e;
    console.error(errorMessage);
  }
}

export function simpleLogger(logInfo: LoggerAction) {
  if (__DEV__) {
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
}
